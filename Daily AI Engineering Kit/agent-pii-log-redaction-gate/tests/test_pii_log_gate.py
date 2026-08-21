import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("pii_log_gate", ROOT / "scripts" / "pii_log_gate.py")
MOD = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MOD)

POLICY = {
    "replacement": "[REDACTED:{type}]",
    "patterns": {k: True for k in MOD.PATTERNS},
    "allowlist": {"literals": [], "regexes": []},
    "severity": {"email": "medium", "jwt": "critical", "bearer_token": "critical", "connection_string_secret": "critical", "api_key_like": "critical", "credit_card_like": "high", "phone": "medium", "ipv4": "low"},
}

def types(text):
    return {f["type"] for f in MOD.scan_text(text, Path("sample.log"), POLICY)}

def test_detects_email_and_bearer_without_exposing_sample():
    findings = MOD.scan_text("user=alice@example.test Authorization=Bearer abcdefghijklmnop", Path("sample.log"), POLICY)
    assert {x["type"] for x in findings} >= {"email", "bearer_token"}
    assert all(x["sample"] == "[REDACTED]" for x in findings)

def test_redacts_sensitive_values():
    text = "email=alice@example.test Password=synthetic-password-123"
    out = MOD.redact_text(text, POLICY)
    assert "alice@example.test" not in out
    assert "synthetic-password-123" not in out
    assert "[REDACTED:email]" in out
    assert "[REDACTED:connection_string_secret]" in out

def test_luhn_filters_non_card_numbers():
    assert "credit_card_like" not in types("request_id=1234567890123456")
    assert "credit_card_like" in types("payment=4111 1111 1111 1111")

def test_allowlist_literal_suppresses_known_safe_value():
    policy = {**POLICY, "allowlist": {"literals": ["ops@example.test"], "regexes": []}}
    findings = MOD.scan_text("owner=ops@example.test", Path("sample.log"), policy)
    assert findings == []

def test_safe_log_passes():
    safe = (ROOT / "examples" / "sample.log").read_text(encoding="utf-8")
    assert MOD.scan_text(safe, Path("sample.log"), POLICY) == []
