#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path

DEFAULT_POLICY = {
    "max_value_chars": 2000,
    "trusted_sources": ["user-explicit", "admin-policy"],
    "blocked_instruction_patterns": [
        "ignore previous", "override system", "send credentials",
        "exfiltrate", "disable security", "persist this instruction"
    ],
    "high_risk_namespaces": ["credentials", "security-policy", "tool-authorization"],
    "require_human_approval_for_untrusted_write": True
}


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc


def evaluate(event, policy=None):
    policy = policy or DEFAULT_POLICY
    required = {"key", "value", "source_type", "source_ref", "namespace"}
    missing = sorted(required - set(event))
    if missing:
        return {"ok": False, "decision": "block", "reasons": [f"missing:{x}" for x in missing]}

    value = event["value"]
    if not isinstance(value, str):
        return {"ok": False, "decision": "block", "reasons": ["value_not_string"]}

    reasons = []
    if len(value) > int(policy.get("max_value_chars", 2000)):
        reasons.append("value_too_large")

    source_type = event["source_type"]
    trusted_sources = set(policy.get("trusted_sources", []))
    if source_type not in trusted_sources:
        reasons.append("untrusted_source")

    lowered = value.casefold()
    for pattern in policy.get("blocked_instruction_patterns", []):
        if str(pattern).casefold() in lowered:
            reasons.append("instruction_pattern:" + str(pattern))

    if re.search(r"(?i)\b(system|developer)\s*(prompt|message|policy)\b", value):
        reasons.append("control_channel_reference")

    if event["namespace"] in set(policy.get("high_risk_namespaces", [])):
        reasons.append("high_risk_namespace")

    if source_type not in trusted_sources and policy.get("require_human_approval_for_untrusted_write", True):
        if not bool(event.get("human_approved", False)):
            reasons.append("human_approval_required")

    if reasons:
        return {
            "ok": False,
            "decision": "quarantine",
            "key": event["key"],
            "source_ref": event["source_ref"],
            "provenance": source_type,
            "reasons": sorted(set(reasons))
        }

    return {
        "ok": True,
        "decision": "allow",
        "key": event["key"],
        "source_ref": event["source_ref"],
        "provenance": source_type,
        "constraints": ["retain_provenance", "auditable_write"]
    }


def main():
    parser = argparse.ArgumentParser(description="Gate persistent AI-memory writes by provenance and policy.")
    parser.add_argument("--event", required=True, help="Path to memory-write event JSON")
    parser.add_argument("--policy", help="Optional policy JSON; defaults to built-in secure policy")
    args = parser.parse_args()

    try:
        event = load_json(args.event)
        policy = load_json(args.policy) if args.policy else DEFAULT_POLICY
        result = evaluate(event, policy)
    except ValueError as exc:
        print(json.dumps({"ok": False, "error": str(exc)}))
        return 2

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())
