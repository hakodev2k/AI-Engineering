#!/usr/bin/env python3
import argparse, json, pathlib, sys

REQUIRED_EVIDENCE = ["schema_before", "schema_after", "application_compatibility", "backfill_plan", "rollback_or_forward_fix", "verification_query"]
REQUIRED_VERIFICATION = ["build", "tests", "schema_check", "data_check", "compatibility_check"]
PASSABLE = {"passed", "not-applicable"}

def main():
    p = argparse.ArgumentParser(description="Verify migration evidence contract without external dependencies.")
    p.add_argument("evidence")
    args = p.parse_args()
    path = pathlib.Path(args.evidence)
    if not path.is_file():
        print(f"missing evidence file: {path}", file=sys.stderr); return 2
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"invalid json: {exc}", file=sys.stderr); return 2
    errors = []
    for key in ["migration_id", "status", "changes", "evidence", "approval_required", "verification"]:
        if key not in data: errors.append(f"missing field: {key}")
    ev = data.get("evidence", {})
    for key in REQUIRED_EVIDENCE:
        if not isinstance(ev.get(key), str) or not ev.get(key, "").strip(): errors.append(f"missing evidence: {key}")
    ver = data.get("verification", {})
    for key in REQUIRED_VERIFICATION:
        value = ver.get(key)
        if value not in PASSABLE: errors.append(f"verification not passed: {key}={value}")
    if data.get("approval_required") and not str(data.get("approval_reference") or "").strip():
        errors.append("approval_reference required for approval-required migration")
    if data.get("status") != "verified": errors.append("status must be verified")
    if errors:
        print(json.dumps({"status": "failed", "errors": errors}, indent=2)); return 1
    print(json.dumps({"status": "verified", "migration_id": data["migration_id"]}, indent=2)); return 0

if __name__ == "__main__":
    raise SystemExit(main())
