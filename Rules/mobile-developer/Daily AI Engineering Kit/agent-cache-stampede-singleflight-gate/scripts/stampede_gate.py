#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

REQUIRED = {"key", "concurrent_callers", "origin_calls", "max_wait_ms", "lock_timeout_ms", "load_timeout_ms", "all_waiters_completed", "leader_failure_released"}

def load(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"invalid input: {exc}", file=sys.stderr)
        sys.exit(2)

def main():
    p = argparse.ArgumentParser(description="Validate cache singleflight/stampede test evidence")
    p.add_argument("evidence", type=Path)
    p.add_argument("--max-origin-calls", type=int, default=1)
    p.add_argument("--max-wait-ms", type=int, default=5000)
    args = p.parse_args()
    data = load(args.evidence)
    missing = REQUIRED - data.keys()
    if missing:
        print("missing fields: " + ", ".join(sorted(missing)), file=sys.stderr)
        return 2
    failures = []
    if int(data["concurrent_callers"]) < 2:
        failures.append("test must use concurrent callers")
    if int(data["origin_calls"]) > args.max_origin_calls:
        failures.append(f"origin_calls={data['origin_calls']} > {args.max_origin_calls}")
    if int(data["max_wait_ms"]) > args.max_wait_ms:
        failures.append(f"max_wait_ms={data['max_wait_ms']} > {args.max_wait_ms}")
    if not bool(data["all_waiters_completed"]):
        failures.append("not all waiters completed")
    if not bool(data["leader_failure_released"]):
        failures.append("leader failure did not release coordination")
    if int(data["lock_timeout_ms"]) <= 0 or int(data["load_timeout_ms"]) <= 0:
        failures.append("timeouts must be positive")
    result = {"status": "fail" if failures else "pass", "key": data["key"], "failures": failures}
    print(json.dumps(result, indent=2))
    return 1 if failures else 0

if __name__ == "__main__":
    raise SystemExit(main())
