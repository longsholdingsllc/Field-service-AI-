from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, Header, Depends
from fastapi.responses import FileResponse, JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from notifications import notify_new_lead  # noqa: E402  (after load_dotenv)
from roundup import send_daily_roundup  # noqa: E402

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


# ---- Admin auth dependency ----
def require_admin(x_admin_token: Optional[str] = Header(default=None)):
    expected = (os.environ.get("ADMIN_TOKEN") or "").strip()
    if not expected:
        raise HTTPException(status_code=503, detail="Admin not configured")
    if not x_admin_token or x_admin_token.strip() != expected:
        raise HTTPException(status_code=401, detail="Invalid or missing admin token")
    return True


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class LeadCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    business: str | None = Field(default=None, max_length=160)
    phone: str = Field(..., min_length=5, max_length=40)
    email: str = Field(..., min_length=3, max_length=160)
    source: str | None = Field(default="landing-cta", max_length=60)
    variant: str | None = Field(default=None, max_length=40)


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    business: str | None = None
    phone: str
    email: str
    source: str = "landing-cta"
    variant: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


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


@api_router.post("/leads", response_model=Lead, status_code=201)
async def create_lead(payload: LeadCreate, background_tasks: BackgroundTasks):
    """Persist a demo-request lead from the landing page and notify via email + SMS."""
    email = payload.email.strip().lower()
    if "@" not in email or "." not in email.split("@")[-1]:
        raise HTTPException(status_code=400, detail="Please provide a valid email address.")

    lead = Lead(
        name=payload.name.strip(),
        business=(payload.business or "").strip() or None,
        phone=payload.phone.strip(),
        email=email,
        source=(payload.source or "landing-cta").strip(),
        variant=(payload.variant or "").strip() or None,
    )
    doc = lead.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.leads.insert_one(doc)
    logger.info("New lead captured: %s · %s · variant=%s", lead.name, lead.email, lead.variant)

    # Fire-and-forget notifications — never block the HTTP response.
    background_tasks.add_task(notify_new_lead, doc)
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def list_leads(limit: int = 100, _: bool = Depends(require_admin)):
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(min(max(limit, 1), 500))
    for d in docs:
        if isinstance(d.get("created_at"), str):
            d["created_at"] = datetime.fromisoformat(d["created_at"])
    return docs


@api_router.get("/leads/stats")
async def lead_stats(_: bool = Depends(require_admin)):
    """Aggregate lead counts by variant — used to compare A/B variants."""
    pipeline = [
        {"$group": {"_id": {"$ifNull": ["$variant", "unknown"]}, "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    rows = await db.leads.aggregate(pipeline).to_list(50)
    total = sum(r["count"] for r in rows)
    return {
        "total": total,
        "by_variant": [
            {"variant": r["_id"], "count": r["count"], "share": (r["count"] / total) if total else 0}
            for r in rows
        ],
    }


@api_router.post("/admin/roundup/send")
async def trigger_roundup(_: bool = Depends(require_admin)):
    """Manually trigger the daily roundup email (for testing / replays)."""
    return await send_daily_roundup(db)


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
    try:
        if scheduler.running:
            scheduler.shutdown(wait=False)
    except Exception:
        pass


# ---- APScheduler for daily roundup ----
from apscheduler.schedulers.asyncio import AsyncIOScheduler  # noqa: E402

scheduler = AsyncIOScheduler(timezone="UTC")


@app.on_event("startup")
async def _start_scheduler():
    # Run every day at 09:00 UTC
    scheduler.add_job(
        send_daily_roundup,
        "cron",
        hour=9,
        minute=0,
        args=[db],
        id="daily_lead_roundup",
        replace_existing=True,
    )
    scheduler.start()
    logger.info("Scheduler started — daily lead roundup at 09:00 UTC.")
