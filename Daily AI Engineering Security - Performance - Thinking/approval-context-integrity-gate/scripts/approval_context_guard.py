#!/usr/bin/env python3
"""Fail-closed integrity check for permission-bearing tool calls."""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path

SENSITIVE = {"shell", "write", "delete", "mcp-mutation", "deploy", "credential", "network-write", "production"}
BAD_PARSE = {"defaulted", "error"}

def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)

def sha(value):
    return hashlib.sha256(canonical(value).encode("utf-8")).hexdigest()

def evaluate(doc):
    if not isinstance(doc, dict):
        raise ValueError("input must be a JSON object")
    source, display = doc.get("source"), doc.get("display")
    if not isinstance(source, dict) or not isinstance(display, dict):
        raise ValueError("source and display objects are required")
    call_id, tool_name = source.get("toolCallId"), source.get("toolName")
    if not isinstance(call_id, str) or not call_id:
        raise ValueError("source.toolCallId must be a non-empty string")
    if not isinstance(tool_name, str) or not tool_name:
        raise ValueError("source.toolName must be a non-empty string")

    risk = doc.get("risk", "read-only")
    sensitive = bool(doc.get("sensitive", risk in SENSITIVE))
    parse_status = source.get("rawInputParseStatus", "ok")
    if parse_status not in {"ok", "absent", "defaulted", "error"}:
        raise ValueError("invalid rawInputParseStatus")

    reasons = []
    src_has = "rawInput" in source and source.get("rawInput") is not None
    dsp_has = "rawInput" in display and display.get("rawInput") is not None
    if sensitive and parse_status in BAD_PARSE:
        reasons.append(f"source_input_{parse_status}")
    if sensitive and (parse_status == "absent" or not src_has):
        reasons.append("source_input_missing")
    if sensitive and not dsp_has:
        reasons.append("display_input_missing")

    action_hash = sha(source.get("rawInput")) if src_has else None
    display_hash = sha(display.get("rawInput")) if dsp_has else None
    if src_has and dsp_has and action_hash != display_hash:
        reasons.append("source_display_payload_mismatch")
    if display.get("toolName") not in (None, tool_name):
        reasons.append("tool_name_mismatch")

    decision = doc.get("decision")
    if decision is not None:
        if not isinstance(decision, dict):
            raise ValueError("decision must be an object")
        bound = decision.get("actionSha256")
        if bound is not None:
            if not isinstance(bound, str) or len(bound) != 64:
                raise ValueError("decision.actionSha256 must be a sha256 hex string")
            if action_hash is None or bound.lower() != action_hash:
                reasons.append("approval_hash_mismatch")

    return {"verdict": "block" if reasons else "allow", "reasons": reasons,
            "toolCallId": call_id, "toolName": tool_name, "risk": risk,
            "sensitive": sensitive, "actionSha256": action_hash,
            "displaySha256": display_hash}

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True, help="approval envelope JSON")
    args = p.parse_args()
    try:
        doc = json.loads(Path(args.input).read_text(encoding="utf-8"))
        result = evaluate(doc)
        print(json.dumps(result, indent=2, sort_keys=True))
        return 0 if result["verdict"] == "allow" else 2
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(json.dumps({"verdict": "error", "error": str(exc)}), file=sys.stderr)
        return 1

if __name__ == "__main__":
    raise SystemExit(main())
