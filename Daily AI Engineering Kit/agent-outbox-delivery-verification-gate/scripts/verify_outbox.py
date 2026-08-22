#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

KINDS = {"outbox-row", "dispatch-attempt", "consumer-observation"}

def main():
    p = argparse.ArgumentParser(description="Verify evidence for an outbox message without mutating infrastructure.")
    p.add_argument("evidence", type=Path)
    args = p.parse_args()
    try:
        data = json.loads(args.evidence.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"invalid evidence: {exc}", file=sys.stderr); return 2
    if not isinstance(data, dict) or not data.get("message_id"):
        print("message_id is required", file=sys.stderr); return 2
    evidence = data.get("evidence") or []
    found = {x.get("kind") for x in evidence if isinstance(x, dict)}
    missing = KINDS - found
    if missing:
        print("missing evidence: " + ", ".join(sorted(missing)), file=sys.stderr); return 3
    verification = data.get("verification") or {}
    if verification.get("result") != "pass":
        print("verification result is not pass", file=sys.stderr); return 4
    if data.get("status") != "verified":
        print("status must be verified", file=sys.stderr); return 4
    print(f"verified message {data['message_id']}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
