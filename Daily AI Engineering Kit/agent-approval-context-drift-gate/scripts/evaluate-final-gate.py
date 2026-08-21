#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path
FIELDS=["task_id","risk","action_type","target_environment","repository_revision","plan_fingerprint","resource_fingerprint","command_fingerprint","permission_fingerprint","actor_id","dangerous_action"]

def load(p): return json.loads(Path(p).read_text(encoding="utf-8"))
def fp(d): return hashlib.sha256(json.dumps({k:d.get(k) for k in FIELDS},sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()
def main():
    ap=argparse.ArgumentParser(); ap.add_argument("context"); ap.add_argument("approval"); ap.add_argument("--review"); ap.add_argument("--policy",default="config/approval-context-policy.json"); a=ap.parse_args()
    try:
        c,approval,policy=load(a.context),load(a.approval),load(a.policy); fingerprint=fp(c); reasons=[]
        if approval.get("task_id")!=c.get("task_id"): reasons.append("approval-task-mismatch")
        if approval.get("context_fingerprint")!=fingerprint: reasons.append("context-fingerprint-mismatch")
        if approval.get("approved") is not True: reasons.append("approval-not-approved")
        risk=c.get("risk")
        if risk in policy.get("require_independent_review_for",[]):
            if not a.review: reasons.append("missing-review")
            else:
                r=load(a.review)
                if r.get("context_fingerprint")!=fingerprint: reasons.append("review-context-mismatch")
                if r.get("status")!="approved": reasons.append("review-not-approved")
                if r.get("reviewer_id")==c.get("actor_id"): reasons.append("self-review")
        if c.get("dangerous_action") and policy.get("dangerous_actions_require_human_approval",True) and not approval.get("approver_id"): reasons.append("dangerous-action-without-human-approval")
        out={"status":"verified" if not reasons else "blocked","task_id":c.get("task_id"),"context_fingerprint":fingerprint,"reasons":reasons}
        print(json.dumps(out,indent=2)); return 0 if not reasons else 3
    except Exception as e:
        print(json.dumps({"status":"invalid","error":str(e)}),file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())
