"""Backend tests for ServiceSpeak AI - /api/leads endpoint (iter3)."""
import os
import uuid
import pytest
import requests
from datetime import datetime

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- Create Lead: happy path ----
def test_create_lead_and_persist(client):
    unique = f"TEST_{uuid.uuid4().hex[:8]}"
    payload = {
        "name": f"Alex Rivera {unique}",
        "business": "Rivera Plumbing",
        "phone": "5555550199",
        "email": f"{unique}@test.io",
        "source": "landing-cta",
    }
    r = client.post(f"{API}/leads", json=payload, timeout=15)
    assert r.status_code == 201, r.text
    lead = r.json()
    assert "id" in lead and len(lead["id"]) >= 16
    assert lead["name"] == payload["name"]
    assert lead["business"] == payload["business"]
    assert lead["phone"] == payload["phone"]
    assert lead["email"] == payload["email"].lower()
    assert lead["source"] == "landing-cta"
    # created_at is ISO-ish datetime string
    assert "created_at" in lead
    datetime.fromisoformat(lead["created_at"].replace("Z", "+00:00"))

    # Verify persistence via GET /api/leads
    g = client.get(f"{API}/leads", timeout=15)
    assert g.status_code == 200
    arr = g.json()
    assert isinstance(arr, list)
    found = [x for x in arr if x["id"] == lead["id"]]
    assert len(found) == 1
    assert found[0]["email"] == payload["email"].lower()


# ---- Email normalization (lowercased + trimmed) ----
def test_email_lowercased_and_trimmed(client):
    unique = f"TEST_{uuid.uuid4().hex[:8]}"
    payload = {
        "name": "Case Tester",
        "phone": "5555550100",
        "email": f"  {unique}@TEST.IO  ",
    }
    r = client.post(f"{API}/leads", json=payload, timeout=15)
    assert r.status_code == 201, r.text
    assert r.json()["email"] == f"{unique}@test.io".lower()


# ---- Business is optional ----
def test_business_optional_none(client):
    payload = {
        "name": "No Biz",
        "phone": "5555550101",
        "email": f"TEST_{uuid.uuid4().hex[:6]}@test.io",
    }
    r = client.post(f"{API}/leads", json=payload, timeout=15)
    assert r.status_code == 201, r.text
    assert r.json()["business"] in (None, "")


# ---- Validation: empty name -> 422 ----
def test_empty_name_returns_422(client):
    r = client.post(f"{API}/leads", json={
        "name": "",
        "phone": "5555550102",
        "email": "x@y.io",
    }, timeout=15)
    assert r.status_code == 422


# ---- Validation: missing phone -> 422 ----
def test_missing_phone_returns_422(client):
    r = client.post(f"{API}/leads", json={
        "name": "NoPhone",
        "email": "x@y.io",
    }, timeout=15)
    assert r.status_code == 422


# ---- Validation: invalid email -> 400 with detail ----
def test_invalid_email_returns_400(client):
    r = client.post(f"{API}/leads", json={
        "name": "Bad Email",
        "phone": "5555550103",
        "email": "notanemail",
    }, timeout=15)
    assert r.status_code == 400, r.text
    detail = r.json().get("detail", "").lower()
    assert "valid email" in detail


# ---- GET list: sorted desc by created_at ----
def test_list_sorted_desc(client):
    # create two leads in sequence
    import time
    ids = []
    for i in range(2):
        payload = {
            "name": f"SortTest {i}",
            "phone": "5555550104",
            "email": f"TEST_sort_{uuid.uuid4().hex[:6]}_{i}@test.io",
        }
        r = client.post(f"{API}/leads", json=payload, timeout=15)
        assert r.status_code == 201
        ids.append(r.json()["id"])
        time.sleep(0.05)

    r = client.get(f"{API}/leads?limit=50", timeout=15)
    assert r.status_code == 200
    arr = r.json()
    # First occurrences of our ids - second-created must appear before first-created
    idxs = {x["id"]: i for i, x in enumerate(arr) if x["id"] in ids}
    assert ids[0] in idxs and ids[1] in idxs
    assert idxs[ids[1]] < idxs[ids[0]], "list should be sorted desc by created_at"


# ---- GET list: limit is capped at 500 (no error on huge limit) ----
def test_list_limit_capped(client):
    r = client.get(f"{API}/leads?limit=10000", timeout=20)
    assert r.status_code == 200
    assert isinstance(r.json(), list)
    assert len(r.json()) <= 500


# ---- Existing endpoints unaffected ----
def test_root_still_200(client):
    r = client.get(f"{API}/", timeout=15)
    assert r.status_code == 200


def test_demo_call_script_still_200(client):
    r = client.get(f"{API}/audio/demo-call/script", timeout=15)
    assert r.status_code == 200
    assert "lines" in r.json()


def test_demo_call_audio_still_200(client):
    r = client.get(f"{API}/audio/demo-call", timeout=60)
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("audio/mpeg")


def test_status_still_works(client):
    r = client.get(f"{API}/status", timeout=15)
    assert r.status_code == 200
    assert isinstance(r.json(), list)
