#!/usr/bin/env python3
"""Pre-summarization full-envelope budget guard.

Input JSON:
{
  "prompt_tokens": 1500,
  "message_tokens": 90000,
  "metadata_tokens": 8000,
  "required_tokens": 20000,
  "required_ids": ["m1"],
  "retained_required_ids": ["m1"],
  "trim_attempt": 0,
  "payload_fingerprint": "abc",
  "previous_payload_fingerprint": null
}
Exit: 0 allow, 2 invalid, 3 trim required, 4 block.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path


def load(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain an object")
    return value


def num(d: dict, key: str, default=0) -> float:
    v = d.get(key, default)
    if isinstance(v, bool) or not isinstance(v, (int, float)) or v < 0:
        raise ValueError(f"{key} must be a non-negative number")
    return float(v)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("envelope", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    args = parser.parse_args()
    try:
        env, policy = load(args.envelope), load(args.policy)
        limit = num(policy, "context_limit_tokens")
        reserved = num(policy, "reserved_output_tokens")
        margin = num(policy, "safety_margin_tokens")
        policy_prompt = num(policy, "summary_prompt_tokens")
        prompt = max(policy_prompt, num(env, "prompt_tokens"))
        messages = num(env, "message_tokens")
        metadata = num(env, "metadata_tokens")
        required_tokens = num(env, "required_tokens")
        attempt = int(num(env, "trim_attempt"))
        max_attempts = int(num(policy, "max_trim_attempts"))
        required = env.get("required_ids", [])
        retained = env.get("retained_required_ids", [])
        if not isinstance(required, list) or not all(isinstance(x, str) for x in required):
            raise ValueError("required_ids must be strings")
        if not isinstance(retained, list) or not all(isinstance(x, str) for x in retained):
            raise ValueError("retained_required_ids must be strings")

        usable = limit - reserved - margin
        projected = prompt + messages + metadata
        required_floor = prompt + required_tokens
        missing = sorted(set(required) - set(retained))
        same_payload = bool(env.get("previous_payload_fingerprint")) and env.get("payload_fingerprint") == env.get("previous_payload_fingerprint")

        if usable <= 0:
            decision, code, reasons = "block", 4, ["reserved output and safety margin consume context limit"]
        elif missing and policy.get("require_all_required_ids", True):
            decision, code, reasons = "block", 4, ["required context IDs missing"]
        elif required_floor > usable:
            decision, code, reasons = "block", 4, ["required context alone cannot fit usable budget"]
        elif projected <= usable:
            decision, code, reasons = "allow", 0, []
        elif attempt >= max_attempts:
            decision, code, reasons = "block", 4, ["trim attempt budget exhausted"]
        elif same_payload:
            decision, code, reasons = "block", 4, ["oversized payload unchanged from previous attempt"]
        else:
            decision, code, reasons = "trim", 3, ["projected envelope exceeds usable context budget"]

        print(json.dumps({
            "decision": decision,
            "context_limit_tokens": limit,
            "usable_input_tokens": usable,
            "projected_input_tokens": projected,
            "utilization": round(projected / usable, 4) if usable > 0 else None,
            "missing_required_ids": missing,
            "reasons": reasons,
        }, indent=2))
        return code
    except (KeyError, ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
