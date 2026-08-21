#!/usr/bin/env python3
import argparse, json, subprocess, sys
from pathlib import Path


def load(path): return json.loads(Path(path).read_text(encoding="utf-8"))


def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--record",required=True); ap.add_argument("--diff",required=True); ap.add_argument("--policy",required=True); a=ap.parse_args()
    try: r,d,p=load(a.record),load(a.diff),load(a.policy)
    except Exception as e:
        print(json.dumps({"decision":"block","reasons":[f"input error: {e}"]})); return 2
    validator=Path(__file__).with_name("validate-provenance.py")
    v=subprocess.run([sys.executable,str(validator),"--record",a.record,"--diff",a.diff,"--policy",a.policy],capture_output=True,text=True)
    reasons=[]
    if v.returncode!=0: reasons.append("provenance validation failed")
    high=set(p.get("high_risk_tags",[])); approval=set(p.get("approval_required_tags",[]))
    tags=set(); failed=[]
    for c in r.get("changes",[]):
        tags.update(c.get("risk_tags",[]))
        for check in c.get("verification_checks",[]):
            if check.get("status") != "passed": failed.append(f"{c.get('path')}: verification {check.get('id')}={check.get('status')}")
    if failed: reasons.extend(failed)
    review=r.get("review",{}); decision=review.get("decision","pending")
    if decision in ("pending","needs-revision","block"): reasons.append(f"review decision is {decision}")
    impl=r.get("task",{}).get("implementation_owner",""); reviewer=review.get("reviewer","")
    if tags & high and p.get("require_independent_reviewer_for_high_risk",True) and impl and reviewer and impl==reviewer:
        reasons.append("high-risk diff lacks independent reviewer")
    approval_needed=bool(tags & approval)
    human=r.get("human_approval") or {}
    if approval_needed and not human.get("approved",False):
        out={"decision":"human-approval-required" if not reasons else "block","reasons":reasons+["approval-required risk tag present"],"risk_tags":sorted(tags)}
        print(json.dumps(out,indent=2)); return 3 if out["decision"]=="human-approval-required" else 1
    if reasons:
        print(json.dumps({"decision":"block","reasons":reasons,"risk_tags":sorted(tags)},indent=2)); return 1
    if decision=="human-approval-required" and not human.get("approved",False):
        print(json.dumps({"decision":"human-approval-required","reasons":["reviewer requires human approval"]},indent=2)); return 3
    print(json.dumps({"decision":"pass","reasons":[],"risk_tags":sorted(tags),"diff_sha256":d.get("diff_sha256")},indent=2)); return 0

if __name__=="__main__": raise SystemExit(main())
