from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Audio cache dir
AUDIO_CACHE_DIR = ROOT_DIR / "audio_cache"
AUDIO_CACHE_DIR.mkdir(exist_ok=True)
DEMO_CALL_PATH = AUDIO_CACHE_DIR / "demo_call.mp3"

# Lock to prevent concurrent generation
_audio_gen_lock = asyncio.Lock()

app = FastAPI()
api_router = APIRouter(prefix="/api")


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


# ---- Demo call script (alternating caller/agent voices) ----
DEMO_CALL_SCRIPT = [
    {
        "speaker": "agent",
        "voice": "shimmer",
        "text": "Apex Heating and Air, this is Sarah. How can I help you today?",
    },
    {
        "speaker": "caller",
        "voice": "onyx",
        "text": "Hi, my AC just stopped working and the house is getting really hot. Any chance someone can come out today?",
    },
    {
        "speaker": "agent",
        "voice": "shimmer",
        "text": "Oh no, I'm sorry to hear that. Let's get a technician out as soon as we can. Can I grab your address and a good callback number?",
    },
    {
        "speaker": "caller",
        "voice": "onyx",
        "text": "Yeah, it's seven forty-two Elm Street in Denver. My number is five five five, four one two, eight eight nine zero.",
    },
    {
        "speaker": "agent",
        "voice": "shimmer",
        "text": "Got it. I have a tech available between four and six PM today. Should I lock that in and text you a confirmation?",
    },
    {
        "speaker": "caller",
        "voice": "onyx",
        "text": "Yes please, that would be amazing. Thank you so much.",
    },
    {
        "speaker": "agent",
        "voice": "shimmer",
        "text": "You're all booked. You'll get a text within two minutes with your tech's name and arrival window. Anything else I can help you with today?",
    },
]


async def _generate_demo_call_audio() -> bytes:
    """Generate the demo call audio by concatenating per-line TTS outputs."""
    from emergentintegrations.llm.openai import OpenAITextToSpeech

    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise RuntimeError("EMERGENT_LLM_KEY not configured")

    tts = OpenAITextToSpeech(api_key=api_key)
    chunks: List[bytes] = []
    for line in DEMO_CALL_SCRIPT:
        audio = await tts.generate_speech(
            text=line["text"],
            model="tts-1",
            voice=line["voice"],
            speed=1.05 if line["speaker"] == "caller" else 1.0,
        )
        chunks.append(audio)

    # MP3 frames concatenate cleanly for browser playback.
    return b"".join(chunks)


@api_router.get("/")
async def root():
    return {"message": "ServiceSpeak AI backend"}


@api_router.get("/audio/demo-call/script")
async def get_demo_call_script():
    """Return the transcript with timing-friendly metadata for the player UI."""
    return {
        "lines": [
            {"speaker": line["speaker"], "text": line["text"]}
            for line in DEMO_CALL_SCRIPT
        ]
    }


@api_router.get("/audio/demo-call")
async def get_demo_call_audio():
    """Serve the cached demo-call mp3, generating it on first request."""
    if not DEMO_CALL_PATH.exists():
        async with _audio_gen_lock:
            if not DEMO_CALL_PATH.exists():
                try:
                    audio_bytes = await _generate_demo_call_audio()
                except Exception as e:
                    logging.exception("Failed to generate demo call audio")
                    raise HTTPException(
                        status_code=503,
                        detail=f"Audio generation unavailable: {e}",
                    )
                DEMO_CALL_PATH.write_bytes(audio_bytes)
    return FileResponse(
        DEMO_CALL_PATH,
        media_type="audio/mpeg",
        headers={"Cache-Control": "public, max-age=86400"},
    )


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
