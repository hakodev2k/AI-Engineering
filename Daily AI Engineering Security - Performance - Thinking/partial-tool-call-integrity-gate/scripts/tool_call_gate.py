#!/usr/bin/env python3
"""Fail-closed integrity gate for assembled streamed tool calls.

Exit codes: 0 ready/committed, 3 partial/wait, 4 reconcile, 5 deny, 2 invalid.
The script does not execute tools.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path


def load(path: Path):
    try:
        v = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(v, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return v


def canonical_hash(name, args):
    raw = json.dumps({"tool_name": name, "arguments": args}, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def evaluate(e, p):
    required = ["call_id", "tool_name", "arguments", "stream_state", "terminal_event_seen", "risk_class"]
    missing = [k for k in required if k not in e]
    if missing:
        raise ValueError("missing fields: " + ", ".join(missing))
    if not isinstance(e["arguments"], dict):
        raise ValueError("arguments must be an object")
    if not isinstance(e["terminal_event_seen"], bool):
        raise ValueError("terminal_event_seen must be boolean")
    if e["risk_class"] not in {"read_only", "side_effect"}:
        raise ValueError("risk_class must be read_only or side_effect")

    call_id, name = e["call_id"], e["tool_name"]
    state = e["stream_state"]
    reasons = []
    if state in {"partial", "interrupted"} or not e["terminal_event_seen"]:
        return {"decision":"partial","reason":"stream not proven complete"}, 3
    if p.get("require_nonempty_call_id", True) and (not isinstance(call_id, str) or not call_id.strip()):
        reasons.append("missing call_id")
    if p.get("require_nonempty_tool_name", True) and (not isinstance(name, str) or not name.strip()):
        reasons.append("missing tool_name")
    if p.get("require_schema_valid_arguments", True) and e.get("schema_valid") is not True:
        reasons.append("arguments not schema-validated")
    if e.get("authorized") is not True:
        reasons.append("tool call not authorized")
    if e["arguments"] == {} and name not in set(p.get("allow_empty_object_arguments_only_for_tools", [])):
        reasons.append("empty arguments not explicitly allowed")

    is_side = e["risk_class"] == "side_effect" or name in set(p.get("side_effecting_tools", []))
    if is_side and p.get("require_idempotency_key_for_side_effects", True):
        if not isinstance(e.get("idempotency_key"), str) or not e.get("idempotency_key", "").strip():
            reasons.append("side effect missing idempotency key")

    outcome = e.get("execution_outcome")
    if outcome == "unknown" or state == "unknown":
        return {"decision":"reconcile","reason":"execution outcome unknown; do not blind retry","integrity_sha256":canonical_hash(name, e["arguments"])}, 4

    if reasons:
        return {"decision":"deny","reasons":reasons,"integrity_sha256":canonical_hash(name, e["arguments"])}, 5

    if state == "committed":
        if is_side and p.get("require_postcondition_for_side_effects", True) and e.get("postcondition_verified") is not True:
            return {"decision":"reconcile","reason":"side effect lacks verified postcondition","integrity_sha256":canonical_hash(name, e["arguments"])}, 4
        return {"decision":"committed","integrity_sha256":canonical_hash(name, e["arguments"])}, 0

    if state != "complete":
        return {"decision":"deny","reasons":[f"unexpected executable state: {state}"],"integrity_sha256":canonical_hash(name, e["arguments"])}, 5
    return {"decision":"ready","integrity_sha256":canonical_hash(name, e["arguments"])}, 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("envelope", type=Path)
    ap.add_argument("--policy", required=True, type=Path)
    a = ap.parse_args()
    try:
        result, code = evaluate(load(a.envelope), load(a.policy))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2))
    return code


if __name__ == "__main__":
    raise SystemExit(main())
