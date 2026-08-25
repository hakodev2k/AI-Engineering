#!/usr/bin/env python3
"""Deterministic cross-session message envelope validator.

Exit codes: 0 allow, 2 policy deny, 1 malformed input/runtime error.
No external dependencies.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

REQUIRED = ("message_id", "sender_session", "recipient_session", "sender_role")
CHILD_ROLES = {"workflow_child", "subagent"}


def decide(e: dict) -> dict:
    reasons = []
    for key in REQUIRED:
        if not isinstance(e.get(key), str) or not e[key].strip():
            reasons.append(f"missing:{key}")
    if reasons:
        return {"decision": "deny", "reasons": reasons}

    role = e["sender_role"]
    authority = e.get("authority", "agent")
    if role != "human" and authority == "human":
        reasons.append("agent_cannot_relay_human_authority")

    if role in CHILD_ROLES:
        if not e.get("workflow_id") or not e.get("parent_session"):
            reasons.append("missing_child_lineage")
        same_workflow = bool(e.get("same_workflow", False))
        approved = bool(e.get("human_approved", False))
        if not same_workflow and not approved:
            reasons.append("cross_workflow_child_delivery_requires_human_approval")

    reply_to = e.get("reply_to")
    if reply_to is not None:
        if not isinstance(reply_to, dict):
            reasons.append("invalid_reply_metadata")
        else:
            required_reply = ("message_id", "original_sender_session", "original_recipient_session")
            if any(not reply_to.get(k) for k in required_reply):
                reasons.append("incomplete_reply_metadata")
            else:
                if e["sender_session"] != reply_to["original_recipient_session"]:
                    reasons.append("reply_sender_mismatch")
                if e["recipient_session"] != reply_to["original_sender_session"]:
                    reasons.append("reply_recipient_mismatch")

    return {"decision": "deny" if reasons else "allow", "reasons": reasons}


def load(path: str) -> dict:
    data = sys.stdin.read() if path == "-" else Path(path).read_text(encoding="utf-8")
    obj = json.loads(data)
    if not isinstance(obj, dict):
        raise ValueError("input must be one JSON object")
    return obj


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True, help="JSON file or - for stdin")
    args = ap.parse_args()
    try:
        result = decide(load(args.input))
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(json.dumps({"decision": "error", "error": str(exc)}))
        return 1
    print(json.dumps(result, sort_keys=True))
    return 0 if result["decision"] == "allow" else 2


if __name__ == "__main__":
    raise SystemExit(main())
