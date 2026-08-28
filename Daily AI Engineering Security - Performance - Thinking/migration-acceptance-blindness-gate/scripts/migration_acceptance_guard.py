#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        raise ValueError(f"cannot read {path}: {e}")

def evaluate(report, policy):
    reasons=[]
    required=set(policy.get("required_artifacts", []))
    observed=set(report.get("artifacts", []))
    for item in sorted(required-observed):
        reasons.append(f"missing_artifact:{item}")

    expected=set(report.get("expected_new_markers", []))
    found=set(report.get("found_new_markers", []))
    if expected and not expected.issubset(found):
        for item in sorted(expected-found):
            reasons.append(f"missing_new_marker:{item}")

    residual=set(report.get("residual_legacy_markers", []))
    forbidden=set(policy.get("forbidden_residual_patterns", []))
    for item in sorted(residual & forbidden):
        reasons.append(f"legacy_residual:{item}")

    pass_rate=float(report.get("behavioral_pass_rate", 0.0))
    if pass_rate < float(policy.get("min_behavioral_pass_rate", 1.0)):
        reasons.append("behavioral_regression")

    if policy.get("require_independent_verifier", True) and not report.get("independent_verifier_passed", False):
        reasons.append("independent_verification_missing_or_failed")

    if report.get("migration_attempted", False) is not True:
        reasons.append("migration_not_demonstrated")

    ok=not reasons
    return {
        "ok":ok,
        "decision":"accept" if ok else "reject",
        "reasons":reasons,
        "status":{
            "implemented":bool(report.get("migration_attempted", False)),
            "measured": "behavioral_pass_rate" in report,
            "verified": bool(report.get("independent_verifier_passed", False)) and ok
        }
    }

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--report", required=True)
    ap.add_argument("--policy", required=True)
    args=ap.parse_args()
    try:
        result=evaluate(load(args.report), load(args.policy))
    except Exception as e:
        print(str(e), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3

if __name__=="__main__":
    raise SystemExit(main())
