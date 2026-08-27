#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path


def risk_signals(text):
    normalized = text.casefold()
    patterns = {
        "authority_override": r"\b(ignore|override|disregard)\b.{0,40}\b(previous|system|developer|user)\b",
        "secret_request": r"\b(secret|token|credential|api[_ -]?key|environment variable)\b",
        "external_send": r"\b(post|send|upload|exfiltrat|curl|webhook)\b",
        "approval_bypass": r"\b(skip|disable|bypass)\b.{0,30}\b(approval|permission|review)\b",
    }
    return sorted(name for name, pattern in patterns.items() if re.search(pattern, normalized, re.S))


def evaluate(event, policy):
    required = ["source", "path", "content", "requested_action", "user_authorized_actions"]
    missing = [key for key in required if key not in event]
    if missing:
        return {"decision": "block", "reasons": [f"missing:{key}" for key in missing]}

    content = event["content"]
    if not isinstance(content, str):
        return {"decision": "block", "reasons": ["content_not_string"]}

    trusted_sources = set(policy.get("trusted_instruction_sources", ["system", "developer", "user"]))
    provenance = "trusted_instruction" if event["source"] in trusted_sources else "untrusted_repository_data"
    action = event["requested_action"]
    allowed = set(event.get("user_authorized_actions", []))
    side_effects = set(policy.get("side_effect_actions", []))
    signals = risk_signals(content)
    reasons = []

    if provenance == "untrusted_repository_data" and signals:
        reasons.extend(f"content_signal:{signal}" for signal in signals)

    if (
        provenance == "untrusted_repository_data"
        and action in side_effects
        and policy.get("require_explicit_user_authorization_for_side_effects", True)
        and action not in allowed
    ):
        reasons.append("side_effect_not_explicitly_user_authorized")

    if (
        provenance == "untrusted_repository_data"
        and event.get("destination_from_content", False)
        and policy.get("block_destination_from_untrusted_content", True)
    ):
        reasons.append("destination_derived_from_untrusted_content")

    if (
        provenance == "untrusted_repository_data"
        and action == "credential_read"
        and policy.get("forbid_untrusted_triggered_credential_read", True)
    ):
        reasons.append("credential_read_from_untrusted_trigger_forbidden")

    return {
        "decision": "block" if reasons else "allow_data_only",
        "provenance": provenance,
        "signals": signals,
        "reasons": sorted(set(reasons)),
    }


def main():
    parser = argparse.ArgumentParser(description="Gate side effects derived from repository content.")
    parser.add_argument("--event", required=True, help="Event JSON")
    parser.add_argument("--policy", required=True, help="Policy JSON")
    args = parser.parse_args()
    try:
        event = json.loads(Path(args.event).read_text(encoding="utf-8"))
        policy = json.loads(Path(args.policy).read_text(encoding="utf-8"))
        result = evaluate(event, policy)
    except Exception as exc:
        print(json.dumps({"decision": "error", "error": str(exc)}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 3 if result["decision"] == "block" else 0


if __name__ == "__main__":
    raise SystemExit(main())
