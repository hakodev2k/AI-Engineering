#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path


def load(path):
    try:
        obj = json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(obj, dict):
        raise ValueError("checkpoint must be a JSON object")
    return obj


def verify(checkpoint):
    claims = checkpoint.get("claims")
    loop = checkpoint.get("loop_state")
    if not isinstance(claims, list) or not isinstance(loop, dict):
        return {"ok": False, "decision": "block", "reasons": ["missing_claims_or_loop_state"]}

    reasons, seen = [], set()
    critical = verified_critical = 0
    for claim in claims:
        if not isinstance(claim, dict) or not isinstance(claim.get("id"), str) or claim["id"] in seen:
            reasons.append("invalid_or_duplicate_claim_id")
            continue
        seen.add(claim["id"])
        if claim.get("critical") is True:
            critical += 1
            if claim.get("status") == "verified" and isinstance(claim.get("evidence"), list) and claim["evidence"]:
                verified_critical += 1
            else:
                reasons.append("critical_claim_not_grounded:" + claim["id"])
        if claim.get("status") == "contradicted":
            reasons.append("contradicted_claim:" + claim["id"])

    attempt, maximum = loop.get("attempt"), loop.get("max_attempts")
    if not isinstance(attempt, int) or not isinstance(maximum, int) or maximum < 1:
        reasons.append("invalid_loop_state")
    elif attempt >= maximum:
        reasons.append("retry_budget_exhausted")

    coverage = 1.0 if critical == 0 else verified_critical / critical
    return {
        "ok": not reasons,
        "decision": "continue" if not reasons else "block",
        "critical_verification_coverage": round(coverage, 4),
        "claim_count": len(claims),
        "reasons": sorted(set(reasons)),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("checkpoint")
    args = parser.parse_args()
    try:
        result = verify(load(args.checkpoint))
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())
