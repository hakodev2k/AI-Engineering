#!/usr/bin/env python3
import argparse
import hashlib
import json
import sys
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc


def fingerprint(event):
    canonical = json.dumps(
        {"payload": event.get("payload"), "error": event.get("error", "")},
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    )
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def main():
    parser = argparse.ArgumentParser(description="Bound structured-output terminal retries")
    parser.add_argument("--events", required=True)
    parser.add_argument("--policy", required=True)
    args = parser.parse_args()
    try:
        events = load_json(args.events)
        policy = load_json(args.policy)
        if not isinstance(events, list) or not events:
            raise ValueError("events must be a non-empty JSON array")
        max_repairs = int(policy["max_repair_attempts"])
        max_identical = int(policy["max_identical_invalid_attempts"])
        max_total = int(policy["max_total_terminal_attempts"])
        deadline = float(policy["terminal_deadline_seconds"])
        if min(max_repairs, max_identical, max_total) < 1 or deadline <= 0:
            raise ValueError("retry limits and deadline must be positive")
        for i, event in enumerate(events):
            if not isinstance(event, dict) or not isinstance(event.get("valid"), bool):
                raise ValueError(f"events[{i}] must be an object with boolean valid")
            if "elapsed_seconds" in event and float(event["elapsed_seconds"]) < 0:
                raise ValueError(f"events[{i}].elapsed_seconds must be non-negative")
        attempts = len(events)
        repairs = sum(1 for e in events if bool(e.get("repair", False)))
        latest = events[-1]
        latest_fp = None if latest["valid"] else fingerprint(latest)
        trailing_identical = 0
        if not latest["valid"]:
            for event in reversed(events):
                if event["valid"] or fingerprint(event) != latest_fp:
                    break
                trailing_identical += 1
        elapsed = max(float(e.get("elapsed_seconds", 0)) for e in events)
        base = {
            "attempts": attempts,
            "repair_attempts": repairs,
            "trailing_identical_invalid": trailing_identical,
            "latest_failure_fingerprint": latest_fp,
            "elapsed_seconds": elapsed,
        }
        if latest["valid"]:
            print(json.dumps({"status": "pass", **base}, indent=2))
            return 0
        reasons = []
        if elapsed >= deadline:
            reasons.append("terminal_deadline")
        if attempts >= max_total:
            reasons.append("total_attempt_limit")
        if repairs >= max_repairs:
            reasons.append("repair_attempt_limit")
        if trailing_identical >= max_identical:
            reasons.append("identical_invalid_limit")
        if reasons:
            print(json.dumps({"status": "stop", "reasons": reasons, **base}, indent=2))
            return 2
        print(json.dumps({"status": "repair_allowed", **base}, indent=2))
        return 0
    except (ValueError, KeyError, TypeError) as exc:
        print(json.dumps({"status": "error", "error": str(exc)}), file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
