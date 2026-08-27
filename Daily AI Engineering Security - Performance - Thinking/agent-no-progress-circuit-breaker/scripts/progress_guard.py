#!/usr/bin/env python3
import argparse
import hashlib
import json
from pathlib import Path


def load_jsonl(path):
    rows = []
    for i, line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except Exception as exc:
            raise ValueError(f"line {i}: invalid json: {exc}") from exc
        if not isinstance(row, dict):
            raise ValueError(f"line {i}: event must be an object")
        rows.append(row)
    return rows


def fingerprint(event):
    basis = {
        "action": event.get("action"),
        "target": event.get("target"),
        "result": event.get("result"),
        "verification_receipt": event.get("verification_receipt"),
    }
    raw = json.dumps(basis, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()[:16]


def analyze(rows, policy):
    max_steps = int(policy.get("max_steps", 60))
    max_no_progress = int(policy.get("max_no_progress_steps", 4))
    max_same = int(policy.get("max_same_fingerprint", 3))
    max_tokens = int(policy.get("max_total_tokens", 250000))
    max_verify = int(policy.get("max_repeated_verifications", 3))

    if not rows:
        return {"status": "insufficient_evidence", "decision": "stop", "reasons": ["no_events"]}

    reasons = []
    total_tokens = 0
    no_progress = 0
    max_no_progress_seen = 0
    same_count = 0
    max_same_seen = 0
    last_fp = None
    receipts = []

    for idx, event in enumerate(rows, 1):
        total_tokens += int(event.get("input_tokens", 0) or 0) + int(event.get("output_tokens", 0) or 0)
        progressed = bool(event.get("progress", False))
        no_progress = 0 if progressed else no_progress + 1
        max_no_progress_seen = max(max_no_progress_seen, no_progress)

        fp = fingerprint(event)
        same_count = same_count + 1 if fp == last_fp else 1
        max_same_seen = max(max_same_seen, same_count)
        last_fp = fp

        if event.get("action") == "verify":
            receipts.append(event.get("verification_receipt"))

        if idx > max_steps:
            reasons.append("step_budget_exceeded")
            break
        if total_tokens > max_tokens:
            reasons.append("token_budget_exceeded")
            break
        if no_progress >= max_no_progress:
            reasons.append("no_progress_circuit_open")
            break
        if same_count >= max_same:
            reasons.append("repeated_action_circuit_open")
            break

    repeated_verifications = 0
    run = 1
    for previous, current in zip(receipts, receipts[1:]):
        run = run + 1 if previous == current and previous is not None else 1
        repeated_verifications = max(repeated_verifications, run)
    if repeated_verifications >= max_verify:
        reasons.append("stale_verification_receipt_loop")

    return {
        "status": "measured",
        "decision": "stop" if reasons else "continue",
        "reasons": sorted(set(reasons)),
        "metrics": {
            "steps": len(rows),
            "total_tokens": total_tokens,
            "max_no_progress_steps": max_no_progress_seen,
            "max_same_fingerprint": max_same_seen,
            "max_repeated_verifications": repeated_verifications,
        },
    }


def main():
    parser = argparse.ArgumentParser(description="Detect no-progress autonomous-agent loops.")
    parser.add_argument("--trace", required=True, help="JSONL event trace")
    parser.add_argument("--policy", required=True, help="Policy JSON")
    args = parser.parse_args()
    try:
        rows = load_jsonl(args.trace)
        policy = json.loads(Path(args.policy).read_text(encoding="utf-8"))
        result = analyze(rows, policy)
    except Exception as exc:
        print(json.dumps({"status": "error", "error": str(exc)}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 3 if result["decision"] == "stop" else 0


if __name__ == "__main__":
    raise SystemExit(main())
