#!/usr/bin/env python3
"""Regression tests for schema_preflight.py using only the standard library."""
from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "schema_preflight.py"
PROFILES = json.loads((ROOT / "config" / "provider-profiles.json").read_text(encoding="utf-8"))["profiles"]

spec = importlib.util.spec_from_file_location("schema_preflight", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(mod)


def expect(code: str, findings):
    assert code in {item["code"] for item in findings}, findings


def test_openai_strict_rejects_open_object():
    schema = {"type": "object", "properties": {"x": {"type": "string"}}, "required": ["x"]}
    findings = mod.lint_schema(schema, PROFILES["openai-strict"])
    expect("ADDITIONAL_PROPERTIES", findings)


def test_openai_strict_requires_all_properties():
    schema = {
        "type": "object",
        "properties": {"x": {"type": "string"}, "y": {"type": "string"}},
        "required": ["x"],
        "additionalProperties": False,
    }
    findings = mod.lint_schema(schema, PROFILES["openai-strict"])
    expect("STRICT_REQUIRED", findings)


def test_lookaround_rejected():
    schema = {
        "type": "object",
        "properties": {"x": {"type": "string", "pattern": "^(?!bad).+$"}},
        "required": ["x"],
        "additionalProperties": False,
    }
    findings = mod.lint_schema(schema, PROFILES["openai-strict"])
    expect("PATTERN_LOOKAROUND", findings)


def test_gemini_conservative_rejects_ref_defs():
    schema = {
        "$defs": {"X": {"type": "string"}},
        "type": "object",
        "properties": {"x": {"$ref": "#/$defs/X"}},
    }
    findings = mod.lint_schema(schema, PROFILES["gemini-conservative"])
    expect("DEFS_FORBIDDEN", findings)
    expect("REF_FORBIDDEN", findings)


def test_mcp_baseline_accepts_simple_schema():
    schema = {"type": "object", "properties": {"x": {"type": "integer"}}, "required": ["x"]}
    assert mod.lint_schema(schema, PROFILES["mcp-baseline"]) == []


def test_runtime_required_unknown_type_enum():
    schema = {
        "type": "object",
        "properties": {
            "mode": {"type": "string", "enum": ["safe", "fast"]},
            "count": {"type": "integer"},
        },
        "required": ["mode", "count"],
        "additionalProperties": False,
    }
    findings = mod.runtime_validate(schema, {"mode": "unsafe", "count": "3", "extra": True})
    codes = {x["code"] for x in findings}
    assert {"ARG_ENUM", "ARG_TYPE", "ARG_UNKNOWN"} <= codes


def test_fingerprint_stable_for_key_order():
    assert mod.fingerprint({"b": 2, "a": 1}) == mod.fingerprint({"a": 1, "b": 2})


def main():
    tests = [v for k, v in globals().items() if k.startswith("test_") and callable(v)]
    for test in tests:
        test()
        print(f"PASS {test.__name__}")
    print(f"{len(tests)} tests passed")


if __name__ == "__main__":
    main()
