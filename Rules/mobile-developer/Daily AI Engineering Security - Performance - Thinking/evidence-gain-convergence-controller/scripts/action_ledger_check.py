#!/usr/bin/env python3
"""Validate an observable agent action ledger for convergence violations."""
import argparse, json, pathlib, sys


def main():
    p = argparse.ArgumentParser()
    p.add_argument("ledger", help="JSON array of action records")
    args = p.parse_args()
    try:
        data = json.loads(pathlib.Path(args.ledger).read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"invalid ledger: {exc}", file=sys.stderr); return 2
    if not isinstance(data, list):
        print("ledger must be a JSON array", file=sys.stderr); return 2
    violations, low_streak = [], {}
    seen = {}
    for i, a in enumerate(data):
        required = ["signature", "uncertainty", "expected_gain", "actual_gain", "evidence"]
        missing = [k for k in required if k not in a]
        if missing:
            violations.append({"index": i, "type": "missing_fields", "fields": missing}); continue
        try:
            eg, ag = int(a["expected_gain"]), int(a["actual_gain"])
        except Exception:
            violations.append({"index": i, "type": "invalid_gain"}); continue
        if eg not in range(4) or ag not in range(4): violations.append({"index": i, "type": "gain_out_of_range"})
        key = (str(a["uncertainty"]), str(a["signature"]))
        seen[key] = seen.get(key, 0) + 1
        if ag == 0: low_streak[key] = low_streak.get(key, 0) + 1
        else: low_streak[key] = 0
        if low_streak[key] >= 3:
            violations.append({"index": i, "type": "third_similar_zero_gain_action", "uncertainty": key[0], "signature": key[1]})
        if a.get("status_claim") and not a.get("status_evidence"):
            violations.append({"index": i, "type": "unsupported_status_claim"})
        if a.get("reopens_settled_decision") and not a.get("contradictory_evidence"):
            violations.append({"index": i, "type": "unsupported_decision_reopen"})
    total = len(data)
    avg_gain = round(sum(int(a.get("actual_gain", 0)) for a in data if str(a.get("actual_gain", "")).isdigit()) / total, 3) if total else 0
    result = {"actions": total, "average_actual_gain": avg_gain, "duplicate_signatures": sum(max(0, n-1) for n in seen.values()), "violations": violations, "pass": not violations}
    print(json.dumps(result, indent=2))
    return 0 if not violations else 3

if __name__ == "__main__": raise SystemExit(main())
