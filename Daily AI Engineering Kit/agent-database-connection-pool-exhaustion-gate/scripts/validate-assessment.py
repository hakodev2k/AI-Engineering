#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

ALLOWED_STATUS = {"pass", "fail", "needs-approval", "blocked"}
ALLOWED_CONFIDENCE = {"low", "medium", "high"}
ALLOWED_RISK = {"low", "medium", "high", "critical"}
ALLOWED_VERIFY = {"not-run", "pass", "fail", "partial"}
REQ_FINDING = {"affected_component", "finding", "evidence", "confidence", "risk", "recommended_action", "verification_status"}

def main():
    ap = argparse.ArgumentParser(description="Validate connection-pool safety assessment JSON.")
    ap.add_argument("assessment")
    args = ap.parse_args()
    p = Path(args.assessment)
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"invalid-json: {exc}", file=sys.stderr)
        return 2
    errors = []
    for key in ("status", "summary", "findings", "verification", "unresolved_risks"):
        if key not in data:
            errors.append(f"missing:{key}")
    if data.get("status") not in ALLOWED_STATUS:
        errors.append("invalid:status")
    if not isinstance(data.get("findings", []), list):
        errors.append("invalid:findings")
    else:
        for i, f in enumerate(data.get("findings", [])):
            missing = REQ_FINDING - set(f) if isinstance(f, dict) else REQ_FINDING
            for m in sorted(missing): errors.append(f"finding[{i}].missing:{m}")
            if isinstance(f, dict):
                if f.get("confidence") not in ALLOWED_CONFIDENCE: errors.append(f"finding[{i}].invalid:confidence")
                if f.get("risk") not in ALLOWED_RISK: errors.append(f"finding[{i}].invalid:risk")
                if f.get("verification_status") not in ALLOWED_VERIFY: errors.append(f"finding[{i}].invalid:verification_status")
                if not isinstance(f.get("evidence"), list) or not f.get("evidence"): errors.append(f"finding[{i}].invalid:evidence")
    v = data.get("verification")
    if not isinstance(v, dict):
        errors.append("invalid:verification")
    else:
        for key in ("scanner_exit_code", "tests", "diff_reviewed"):
            if key not in v: errors.append(f"verification.missing:{key}")
    if data.get("status") == "pass":
        if errors:
            pass
        elif any(f.get("verification_status") not in {"pass"} for f in data.get("findings", [])):
            errors.append("pass-requires-all-findings-verified")
        elif v.get("scanner_exit_code") != 0:
            errors.append("pass-requires-scanner-exit-0")
        elif not v.get("diff_reviewed"):
            errors.append("pass-requires-diff-review")
    if errors:
        print("assessment-invalid")
        for e in errors: print(e)
        return 1
    print("assessment-valid")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
