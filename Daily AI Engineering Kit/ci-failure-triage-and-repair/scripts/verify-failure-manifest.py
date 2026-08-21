#!/usr/bin/env python3
import argparse
import json
import os
import sys
from pathlib import Path

CLASSES = {"code-regression","test-regression","configuration","dependency","environment","external-service","flaky","pre-existing","unknown"}
ACTIONS = {"repair","controlled-rerun","escalate","stop"}


def fail(msg):
    print(f"INVALID: {msg}", file=sys.stderr)
    return 1


def main():
    p = argparse.ArgumentParser(description="Validate CI failure manifest invariants.")
    p.add_argument("manifest", nargs="?", default=os.getenv("CI_FAILURE_MANIFEST", "failure-manifest.json"))
    args = p.parse_args()
    path = Path(args.manifest)
    if not path.is_file(): return fail(f"manifest not found: {path}")
    try: data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc: return fail(str(exc))
    required = ["schema_version","failure","classification","evidence","hypotheses","selected_action","verification","retry_state","approvals"]
    missing = [k for k in required if k not in data]
    if missing: return fail("missing fields: " + ", ".join(missing))
    if data["classification"] not in CLASSES: return fail("invalid classification")
    if data["selected_action"] not in ACTIONS: return fail("invalid selected_action")
    if not isinstance(data["evidence"], list) or not data["evidence"]: return fail("at least one evidence item is required")
    hyps = data["hypotheses"]
    if not isinstance(hyps, list) or not (1 <= len(hyps) <= 3): return fail("hypotheses must contain 1..3 items")
    for i, h in enumerate(hyps):
        if not all(h.get(k) for k in ("id","statement","falsification_check")): return fail(f"hypothesis {i} incomplete")
    checks = data.get("verification", {}).get("required_checks", [])
    if data["selected_action"] == "repair" and not checks: return fail("repair requires verification.required_checks")
    retry = data["retry_state"]
    max_repairs = int(os.getenv("CI_TRIAGE_MAX_REPAIR_ATTEMPTS", "2"))
    if retry.get("repair_attempts", 0) > max_repairs: return fail("repair attempt budget exceeded")
    if retry.get("identical_reruns", 0) > 2: return fail("identical rerun budget exceeded")
    if data["selected_action"] == "repair" and data["classification"] in {"external-service","environment","unknown"}:
        return fail("external/environment/unknown classification cannot authorize repair without reclassification")
    dangerous = data.get("approvals", {}).get("required", [])
    approved = set(data.get("approvals", {}).get("approved", []))
    if data["selected_action"] == "repair" and any(x not in approved for x in dangerous):
        return fail("required human approvals are missing")
    print("VALID")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
