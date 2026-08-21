#!/usr/bin/env python3
"""Unit tests for consent_binding_guard.py using only synthetic data."""
from __future__ import annotations
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("guard", ROOT / "scripts" / "consent_binding_guard.py")
guard = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(guard)
POLICY = json.loads((ROOT / "config" / "policy.json").read_text(encoding="utf-8"))


def base():
    return {
        "client_id": "https://client.example/metadata.json",
        "client_metadata": '{"client_name":"Example"}',
        "redirect_uri": "http://127.0.0.1:43127/callback",
        "issuer": "https://auth.example",
        "resource": "https://mcp.example",
        "scopes": ["files.read"],
        "pkce_method": "S256",
        "pkce_challenge": "synthetic-challenge",
        "state": "synthetic-state",
        "browser_session": "synthetic-browser-session",
        "consent_granted": True,
        "attestation_verified": False,
    }


def create():
    result, code = guard.create_record(base(), POLICY)
    assert code == guard.ALLOW
    return result["record"]


def test_valid_callback_allows_once():
    record = create()
    result, code = guard.verify_record(base(), record, POLICY)
    assert code == guard.ALLOW
    assert result["decision"] == "allow"
    result2, code2 = guard.verify_record(base(), result["record"], POLICY)
    assert code2 == guard.DENY
    assert "transaction already used" in result2["reasons"]


def test_redirect_substitution_denied():
    record = create()
    data = base(); data["redirect_uri"] = "http://127.0.0.1:49999/callback"
    result, code = guard.verify_record(data, record, POLICY)
    assert code == guard.DENY and "redirect_uri mismatch" in result["reasons"]


def test_issuer_mixup_denied():
    record = create()
    data = base(); data["issuer"] = "https://evil.example"
    result, code = guard.verify_record(data, record, POLICY)
    assert code == guard.DENY and "issuer mismatch" in result["reasons"]


def test_resource_mixup_denied():
    record = create()
    data = base(); data["resource"] = "https://other-resource.example"
    result, code = guard.verify_record(data, record, POLICY)
    assert code == guard.DENY and "resource mismatch" in result["reasons"]


def test_state_mismatch_denied():
    record = create()
    data = base(); data["state"] = "different"
    result, code = guard.verify_record(data, record, POLICY)
    assert code == guard.DENY and "state mismatch" in result["reasons"]


def test_changed_metadata_denied():
    record = create()
    data = base(); data["client_metadata"] = '{"client_name":"Changed"}'
    result, code = guard.verify_record(data, record, POLICY)
    assert code == guard.DENY and "client metadata changed" in result["reasons"]


def test_loopback_without_consent_requires_approval():
    data = base(); data["consent_granted"] = False
    result, code = guard.create_record(data, POLICY)
    assert code == guard.APPROVAL
    assert result["decision"] == "approval_required"


def test_non_loopback_http_denied():
    data = base(); data["redirect_uri"] = "http://client.example/callback"
    result, code = guard.create_record(data, POLICY)
    assert code == guard.DENY
    assert result["decision"] == "deny"
