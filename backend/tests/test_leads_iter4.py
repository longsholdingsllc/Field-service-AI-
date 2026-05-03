"""Iter4 backend tests — variant A/B field, stats aggregate, notification wiring (non-blocking)."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- variant field accepted + echoed + persisted ----
def test_create_lead_with_variant(client):
    unique = f"TEST_{uuid.uuid4().hex[:8]}"
    payload = {
        "name": f"Variant User {unique}",
        "phone": "5555551000",
        "email": f"{unique}@test.io",
        "variant": "pro_first_mobile",
    }
    r = client.post(f"{API}/leads", json=payload, timeout=15)
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["variant"] == "pro_first_mobile"
    lead_id = body["id"]

    # Verify persistence
    g = client.get(f"{API}/leads?limit=200", timeout=15)
    assert g.status_code == 200
    found = [x for x in g.json() if x["id"] == lead_id]
    assert len(found) == 1
    assert found[0]["variant"] == "pro_first_mobile"


# ---- variant missing/null → variant=null, bucket under 'unknown' in stats ----
def test_create_lead_without_variant_is_unknown_in_stats(client):
    unique = f"TEST_{uuid.uuid4().hex[:8]}"
    payload = {
        "name": f"No Variant {unique}",
        "phone": "5555551001",
        "email": f"{unique}@test.io",
    }
    r = client.post(f"{API}/leads", json=payload, timeout=15)
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["variant"] is None

    s = client.get(f"{API}/leads/stats", timeout=15)
    assert s.status_code == 200
    stats = s.json()
    assert "total" in stats and "by_variant" in stats
    assert isinstance(stats["by_variant"], list)
    variants = {row["variant"]: row for row in stats["by_variant"]}
    assert "unknown" in variants, f"expected 'unknown' bucket, got {list(variants.keys())}"
    assert variants["unknown"]["count"] >= 1


# ---- variant='control' also stored + appears in stats ----
def test_variant_control_in_stats(client):
    unique = f"TEST_{uuid.uuid4().hex[:8]}"
    payload = {
        "name": f"Control {unique}",
        "phone": "5555551002",
        "email": f"{unique}@test.io",
        "variant": "control",
    }
    r = client.post(f"{API}/leads", json=payload, timeout=15)
    assert r.status_code == 201
    assert r.json()["variant"] == "control"

    s = client.get(f"{API}/leads/stats", timeout=15)
    assert s.status_code == 200
    data = s.json()
    variants = {row["variant"]: row for row in data["by_variant"]}
    assert "control" in variants
    assert variants["control"]["count"] >= 1
    # shares sum ~= 1
    total_share = sum(row["share"] for row in data["by_variant"])
    assert 0.99 <= total_share <= 1.01


# ---- POST response is NOT blocked by notification latency (< 1s) ----
def test_post_leads_fast_response(client):
    unique = f"TEST_{uuid.uuid4().hex[:8]}"
    payload = {
        "name": f"Speed {unique}",
        "phone": "5555551003",
        "email": f"{unique}@test.io",
        "variant": "pro_first_mobile",
    }
    t0 = time.perf_counter()
    r = client.post(f"{API}/leads", json=payload, timeout=10)
    elapsed = time.perf_counter() - t0
    assert r.status_code == 201
    # BackgroundTasks shouldn't block — network RT inclusive budget 2.0s
    assert elapsed < 2.0, f"POST /api/leads took {elapsed:.2f}s (expected < 2s)"


# ---- /leads/stats schema ----
def test_stats_schema(client):
    r = client.get(f"{API}/leads/stats", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert set(data.keys()) >= {"total", "by_variant"}
    assert isinstance(data["total"], int)
    for row in data["by_variant"]:
        assert set(row.keys()) >= {"variant", "count", "share"}
        assert isinstance(row["count"], int)
        assert 0.0 <= row["share"] <= 1.0


# ---- Regression: all previous endpoints still work ----
def test_regression_root(client):
    r = client.get(f"{API}/", timeout=10)
    assert r.status_code == 200


def test_regression_demo_script(client):
    r = client.get(f"{API}/audio/demo-call/script", timeout=10)
    assert r.status_code == 200
    assert "lines" in r.json()


def test_regression_demo_audio(client):
    r = client.get(f"{API}/audio/demo-call", timeout=60)
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("audio/mpeg")


def test_regression_status_get(client):
    r = client.get(f"{API}/status", timeout=10)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_regression_status_post(client):
    r = client.post(f"{API}/status", json={"client_name": "TEST_iter4"}, timeout=10)
    assert r.status_code == 200
    assert r.json()["client_name"] == "TEST_iter4"


def test_regression_leads_list(client):
    r = client.get(f"{API}/leads", timeout=10)
    assert r.status_code == 200
    assert isinstance(r.json(), list)
