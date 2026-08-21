#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load(p): return json.loads(Path(p).read_text(encoding="utf-8"))

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--report", required=True); ap.add_argument("--review", required=True); ap.add_argument("--policy", required=True)
    a=ap.parse_args()
    try: report, review, policy = load(a.report), load(a.review), load(a.policy)
    except Exception as e: print(f"ERROR: {e}", file=sys.stderr); return 2
    if review.get("reviewer") == review.get("implementer") and any(s.get("critical") for s in report.get("scenarios", [])) and policy.get("require_independent_reviewer_for_critical", True):
        print("blocked: reviewer is implementer"); return 1
    decisions = {d.get("scenario_id"): d for d in review.get("decisions", []) if isinstance(d, dict)}
    blocked=[]; approval=[]
    critical_categories=set(policy.get("critical_categories", []))
    for s in report.get("scenarios", []):
        if s.get("status") == "no-change": continue
        d=decisions.get(s.get("id"))
        if not d:
            blocked.append(f"{s.get('id')}: missing review decision"); continue
        state=d.get("classification")
        if state in ("regression", "blocked", "needs-human-decision"):
            blocked.append(f"{s.get('id')}: {state}"); continue
        if state == "allowed-change":
            if not d.get("evidence"):
                blocked.append(f"{s.get('id')}: allowed change missing evidence"); continue
            is_critical = bool(s.get("critical")) or s.get("category") in critical_categories
            if is_critical and policy.get("require_human_approval_for_critical_allowed_change", True) and not d.get("human_approval"):
                approval.append(s.get("id"))
        elif state != "no-change":
            blocked.append(f"{s.get('id')}: invalid classification {state}")
    if blocked:
        print("blocked: " + "; ".join(blocked)); return 1
    if approval:
        print("human-approval-required: " + ", ".join(approval)); return 3
    print("verified")
    return 0

if __name__ == "__main__": raise SystemExit(main())