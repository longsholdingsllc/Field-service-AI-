"""Backend tests for ServiceSpeak AI - audio + status endpoints."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://field-service-ai-3.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- Root ----
def test_root(client):
    r = client.get(f"{API}/", timeout=15)
    assert r.status_code == 200
    assert "message" in r.json()


# ---- Audio script ----
def test_demo_call_script(client):
    r = client.get(f"{API}/audio/demo-call/script", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert "lines" in data
    lines = data["lines"]
    assert isinstance(lines, list)
    assert len(lines) >= 7
    for ln in lines:
        assert "speaker" in ln and "text" in ln
        assert ln["speaker"] in ("agent", "caller")
        assert isinstance(ln["text"], str) and len(ln["text"]) > 0


# ---- Audio mp3 ----
def test_demo_call_audio(client):
    # First call may be cached (pre-generated per context). Allow up to 90s.
    r = client.get(f"{API}/audio/demo-call", timeout=90)
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("audio/mpeg")
    assert len(r.content) > 10_000  # non-empty mp3


def test_demo_call_audio_cached_fast(client):
    import time
    t0 = time.time()
    r = client.get(f"{API}/audio/demo-call", timeout=15)
    elapsed = time.time() - t0
    assert r.status_code == 200
    assert elapsed < 5.0, f"Cached call too slow: {elapsed}s"


# ---- Status CRUD ----
def test_status_post_and_get(client):
    payload = {"client_name": "TEST_backend_iter2"}
    r = client.post(f"{API}/status", json=payload, timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data["client_name"] == "TEST_backend_iter2"
    assert "id" in data and "timestamp" in data

    # GET list
    r2 = client.get(f"{API}/status", timeout=15)
    assert r2.status_code == 200
    arr = r2.json()
    assert isinstance(arr, list)
    assert any(x.get("client_name") == "TEST_backend_iter2" for x in arr)
