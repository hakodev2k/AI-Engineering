#!/usr/bin/env python3
import argparse
import json
import pathlib
import sys

ALLOWED_STATUS = {"pass", "fail", "blocked", "needs-approval", "inconclusive"}
ALLOWED_RISK = {"low", "medium", "high"}

def fail(msg):
    print(f"error: {msg}", file=sys.stderr)
    return False

def main():
    ap = argparse.ArgumentParser(description="Validate cache invalidation assessment contract.")
    ap.add_argument("assessment")
    args = ap.parse_args()
    p = pathlib.Path(args.assessment)
    if not p.is_file():
        print(f"error: file not found: {p}", file=sys.stderr)
        return 2
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"error: invalid JSON: {e}", file=sys.stderr)
        return 2

    ok = True
    if data.get("status") not in ALLOWED_STATUS:
        ok &= fail("invalid status")
    findings = data.get("findings")
    if not isinstance(findings, list):
        ok &= fail("findings must be an array")
        findings = []
    required = {"cache_key", "mutation_source", "invalidation_path", "consistency_expectation", "risk"}
    for i, item in enumerate(findings):
        if not isinstance(item, dict):
            ok &= fail(f"findings[{i}] must be an object")
            continue
        missing = [k for k in required if not item.get(k)]
        if missing:
            ok &= fail(f"findings[{i}] missing/non-empty fields: {', '.join(missing)}")
        if item.get("risk") not in ALLOWED_RISK:
            ok &= fail(f"findings[{i}] invalid risk")
    verification = data.get("verification")
    if not isinstance(verification, dict):
        ok &= fail("verification must be an object")
    else:
        if verification.get("result") not in {"pass", "fail", "blocked", "inconclusive"}:
            ok &= fail("verification.result invalid")
        if not isinstance(verification.get("checks"), list) or not verification.get("checks"):
            ok &= fail("verification.checks must be a non-empty array")
    if data.get("status") == "pass" and verification and verification.get("result") != "pass":
        ok &= fail("status=pass requires verification.result=pass")
    return 0 if ok else 1

if __name__ == "__main__":
    raise SystemExit(main())
