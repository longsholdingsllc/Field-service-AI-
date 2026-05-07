"""Iter5 backend tests — token-protected admin endpoints + scheduler."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"

# Read ADMIN_TOKEN directly from backend .env (test env doesn't load it)
ADMIN_TOKEN = None
try:
    with open("/app/backend/.env") as f:
        for line in f:
            if line.startswith("ADMIN_TOKEN="):
                ADMIN_TOKEN = line.split("=", 1)[1].strip()
                break
except Exception:
    pass


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_headers():
    assert ADMIN_TOKEN, "ADMIN_TOKEN not found in /app/backend/.env"
    return {"X-Admin-Token": ADMIN_TOKEN}


# ---- /api/leads now requires admin token ----
def test_leads_no_token_returns_401(client):
    r = client.get(f"{API}/leads", timeout=10)
    assert r.status_code == 401
    assert "Invalid or missing admin token" in r.json().get("detail", "")


def test_leads_wrong_token_returns_401(client):
    r = client.get(f"{API}/leads", headers={"X-Admin-Token": "WRONG_BOGUS_TOKEN"}, timeout=10)
    assert r.status_code == 401


def test_leads_correct_token_returns_200_sorted_desc(client, admin_headers):
    # Seed two leads to ensure ordering can be verified
    for i in range(2):
        u = f"TEST_{uuid.uuid4().hex[:8]}"
        client.post(
            f"{API}/leads",
            json={
                "name": f"Iter5 {u}",
                "phone": "5555550000",
                "email": f"{u}@test.io",
                "variant": "control",
            },
            timeout=10,
        )

    r = client.get(f"{API}/leads", headers=admin_headers, timeout=10)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 2
    # Verify desc sort by created_at (string ISO comparable)
    for i in range(len(data) - 1):
        a = data[i].get("created_at") or ""
        b = data[i + 1].get("created_at") or ""
        assert str(a) >= str(b), f"not desc at idx {i}: {a} < {b}"


# ---- /api/leads/stats — same auth rules ----
def test_stats_no_token_returns_401(client):
    r = client.get(f"{API}/leads/stats", timeout=10)
    assert r.status_code == 401


def test_stats_wrong_token_returns_401(client):
    r = client.get(f"{API}/leads/stats", headers={"X-Admin-Token": "WRONG"}, timeout=10)
    assert r.status_code == 401


def test_stats_correct_token_schema(client, admin_headers):
    r = client.get(f"{API}/leads/stats", headers=admin_headers, timeout=10)
    assert r.status_code == 200
    data = r.json()
    assert set(data.keys()) >= {"total", "by_variant"}
    assert isinstance(data["total"], int)
    assert isinstance(data["by_variant"], list)
    for row in data["by_variant"]:
        assert {"variant", "count", "share"} <= set(row.keys())
        assert 0.0 <= row["share"] <= 1.0


# ---- /api/admin/roundup/send protected + works ----
def test_roundup_no_token_returns_401(client):
    r = client.post(f"{API}/admin/roundup/send", timeout=10)
    assert r.status_code == 401


def test_roundup_wrong_token_returns_401(client):
    r = client.post(f"{API}/admin/roundup/send", headers={"X-Admin-Token": "WRONG"}, timeout=10)
    assert r.status_code == 401


def test_roundup_correct_token_returns_200(client, admin_headers):
    r = client.post(f"{API}/admin/roundup/send", headers=admin_headers, timeout=30)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body.get("status") in {"sent", "skipped", "error"}
    assert "leads" in body or body.get("status") == "error"


# ---- POST /api/leads remains PUBLIC ----
def test_post_leads_public_no_auth_required(client):
    u = f"TEST_{uuid.uuid4().hex[:8]}"
    r = client.post(
        f"{API}/leads",
        json={
            "name": f"Public {u}",
            "phone": "5555559999",
            "email": f"{u}@test.io",
            "variant": "pro_first_mobile",
        },
        timeout=10,
    )
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["variant"] == "pro_first_mobile"
    assert "id" in body


# ---- Existing public endpoints unaffected ----
def test_root_public(client):
    r = client.get(f"{API}/", timeout=10)
    assert r.status_code == 200


def test_demo_script_public(client):
    r = client.get(f"{API}/audio/demo-call/script", timeout=10)
    assert r.status_code == 200
    assert "lines" in r.json()


def test_status_public_get(client):
    r = client.get(f"{API}/status", timeout=10)
    assert r.status_code == 200


def test_status_public_post(client):
    r = client.post(f"{API}/status", json={"client_name": "TEST_iter5"}, timeout=10)
    assert r.status_code == 200
