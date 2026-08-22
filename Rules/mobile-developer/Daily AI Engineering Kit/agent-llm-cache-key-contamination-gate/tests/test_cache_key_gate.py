import importlib.util
import json
from pathlib import Path

MODULE = Path(__file__).parents[1] / "scripts" / "cache_key_gate.py"
spec = importlib.util.spec_from_file_location("cache_key_gate", MODULE)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

POLICY = {
    "key_fields": ["model", "system_prompt_hash", "user_prompt_hash", "tool_schema_hash", "temperature", "response_format", "tenant_id", "data_scope"],
    "namespace_required": True,
    "max_ttl_seconds": 3600,
    "reject_missing_context_fields": True,
    "sensitive_data_patterns": ["api_key", "authorization", "access_token", "password", "secret"],
}


def request(tenant="tenant-a", user="hello", scope="kb-a"):
    return {
        "model": "gpt-example",
        "system_prompt": "You are helpful",
        "user_prompt": user,
        "tool_schema": {"tools": []},
        "temperature": 0,
        "response_format": {"type": "json"},
        "tenant_id": tenant,
        "data_scope": scope,
        "requested_ttl_seconds": 600,
    }


def test_same_inputs_produce_same_key():
    a = mod.evaluate(request(), POLICY)
    b = mod.evaluate(request(), POLICY)
    assert a["status"] == "PASS"
    assert a["cache_key"] == b["cache_key"]


def test_tenant_changes_key():
    a = mod.evaluate(request("tenant-a"), POLICY)
    b = mod.evaluate(request("tenant-b"), POLICY)
    assert a["cache_key"] != b["cache_key"]


def test_prompt_changes_key():
    a = mod.evaluate(request(user="one"), POLICY)
    b = mod.evaluate(request(user="two"), POLICY)
    assert a["cache_key"] != b["cache_key"]


def test_missing_scope_blocks():
    r = request(scope="")
    result = mod.evaluate(r, POLICY)
    assert result["status"] == "BLOCK"
    assert result["cache_key"] is None


def test_ttl_is_clamped():
    r = request()
    r["requested_ttl_seconds"] = 99999
    result = mod.evaluate(r, POLICY)
    assert result["ttl_seconds"] == 3600
    assert result["warnings"]
