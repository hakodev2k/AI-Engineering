#!/usr/bin/env python3
import argparse, json, sys
from datetime import datetime, timezone

def load(path):
    with open(path,"r",encoding="utf-8") as f:return json.load(f)

def main():
    p=argparse.ArgumentParser(); p.add_argument("--report",required=True); p.add_argument("--policy",required=True); p.add_argument("--review",required=True); p.add_argument("--output",required=True); a=p.parse_args()
    try: report,policy,review=load(a.report),load(a.policy),load(a.review)
    except Exception as e: print(f"ERROR: {e}",file=sys.stderr); return 2
    blocking=set(policy.get("gate",{}).get("blocking_severities",["critical","high"]))
    approval=set(policy.get("gate",{}).get("approval_severities",["critical"]))
    independent=set(policy.get("gate",{}).get("require_independent_review_for",["critical","high"]))
    findings=report.get("findings",[])
    exceptions={e.get("key"):e for e in review.get("exceptions",[]) if isinstance(e,dict) and e.get("status") in policy.get("allowed_exception_statuses",["approved"])}
    unapproved=[]; needs_approval=[]; independent_required=False
    for f in findings:
        sev=f.get("severity","medium"); key=f.get("key")
        ex=exceptions.get(key)
        excepted=bool(ex and ex.get("environment")==report.get("environment") and ex.get("kind")==f.get("kind") and ex.get("expires_at"))
        if sev in independent: independent_required=True
        if sev in blocking and not excepted: unapproved.append(f)
        if sev in approval and not excepted: needs_approval.append(f)
    producer=report.get("expected_producer")
    reviewer=review.get("reviewer")
    independence_ok=not independent_required or (reviewer and reviewer!=producer)
    review_status=review.get("status")
    reasons=[]
    if not independence_ok: reasons.append("independent review required")
    if review_status not in {"approved","verified","accepted","clean"}: reasons.append("review status is not acceptable")
    if needs_approval: decision="human-approval-required"
    elif unapproved or reasons: decision="block"
    else: decision="pass"
    result={"decision":decision,"application":report.get("application"),"environment":report.get("environment"),"finding_count":len(findings),"blocking_findings":unapproved,"approval_findings":needs_approval,"independent_review_ok":independence_ok,"reasons":reasons,"evaluated_at":datetime.now(timezone.utc).isoformat()}
    with open(a.output,"w",encoding="utf-8") as f: json.dump(result,f,indent=2,sort_keys=True)
    print(json.dumps({"decision":decision,"blocking_count":len(unapproved),"approval_count":len(needs_approval)},indent=2))
    return 0 if decision=="pass" else (3 if decision=="human-approval-required" else 1)
if __name__=="__main__": raise SystemExit(main())
