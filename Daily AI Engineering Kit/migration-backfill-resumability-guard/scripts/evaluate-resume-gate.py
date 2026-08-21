#!/usr/bin/env python3
import argparse, json, sys
from datetime import datetime, timezone

def iso(v):
    if v.endswith("Z"): v=v[:-1]+"+00:00"
    return datetime.fromisoformat(v).astimezone(timezone.utc)

def main():
    p=argparse.ArgumentParser();
    for n in ["plan","checkpoint","validation","review","policy"]: p.add_argument("--"+n,required=True)
    p.add_argument("--actor",required=True); p.add_argument("--now"); p.add_argument("--output")
    a=p.parse_args(); reasons=[]
    try:
        plan=json.load(open(a.plan)); cp=json.load(open(a.checkpoint)); val=json.load(open(a.validation)); review=json.load(open(a.review)); policy=json.load(open(a.policy))
        now=iso(a.now) if a.now else datetime.now(timezone.utc)
        if val.get("status")!="valid": reasons.append("state-validation-failed")
        if cp.get("plan_fingerprint")!=plan.get("plan_fingerprint"): reasons.append("stale-checkpoint")
        if cp.get("status") in ["completed","blocked"]: reasons.append("checkpoint-not-resumable")
        lease=iso(cp["lease_expires_at"])
        if cp.get("lease_owner") and cp.get("lease_owner")!=a.actor and lease>now: reasons.append("active-lease-owned-by-other-actor")
        high=plan.get("environment") in policy.get("require_independent_review_for",[]) or plan.get("risk") in policy.get("require_independent_review_for",[])
        if review.get("plan_fingerprint")!=plan.get("plan_fingerprint"): reasons.append("review-fingerprint-mismatch")
        if high and review.get("reviewer_id")==a.actor: reasons.append("independent-review-required")
        if review.get("verdict") not in ["resume-approved","execute-approved"]: reasons.append("review-not-approved")
        decision="allow" if not reasons else "block"
        out={"decision":decision,"reasons":reasons,"checkpoint_version":cp.get("checkpoint_version"),"plan_fingerprint":plan.get("plan_fingerprint")}
        if a.output: json.dump(out,open(a.output,"w"),indent=2); open(a.output,"a").write("\n")
        else: print(json.dumps(out,indent=2))
        return 0 if decision=="allow" else 4
    except Exception as e:
        print(f"error: {e}",file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())
