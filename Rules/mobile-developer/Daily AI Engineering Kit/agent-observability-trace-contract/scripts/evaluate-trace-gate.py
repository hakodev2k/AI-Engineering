#!/usr/bin/env python3
import argparse, json
from pathlib import Path

def load(path): return json.loads(Path(path).read_text(encoding="utf-8"))
def main():
    p=argparse.ArgumentParser(); p.add_argument("--trace",required=True); p.add_argument("--policy",required=True); p.add_argument("--review",required=True); p.add_argument("--output",required=True); a=p.parse_args()
    policy=load(a.policy); review=load(a.review); events=[json.loads(x) for x in Path(a.trace).read_text(encoding="utf-8").splitlines() if x.strip()]
    reasons=[]; status="verified"
    if not events: reasons.append("empty-trace")
    risks={e.get("risk","low") for e in events}; executor=next((e.get("actor") for e in events if e.get("event")=="task.started"),None)
    if any(r in policy.get("independent_review_for_risk",[]) for r in risks) and review.get("reviewer_id")==executor:
        reasons.append("reviewer-not-independent")
    if review.get("status")!="verified": reasons.append("review-not-verified")
    ver=[e for e in events if e.get("event")=="verification.completed"]
    if not ver or not any(e.get("status")=="completed" and e.get("evidence_refs") for e in ver): reasons.append("verification-evidence-missing")
    approvals=[e for e in events if e.get("event")=="approval.granted" and e.get("status")=="granted"]
    for e in events:
        if e.get("side_effect_class") in policy.get("approval_required_side_effects",[]) and e.get("event")=="tool.started":
            if not approvals: reasons.append("approval-evidence-missing")
    if reasons:
        status="blocked" if any(r in reasons for r in ["reviewer-not-independent","review-not-verified","verification-evidence-missing","approval-evidence-missing","empty-trace"]) else "observability-incomplete"
    out={"status":status,"reasons":sorted(set(reasons)),"trace_id":events[0].get("trace_id") if events else None}
    Path(a.output).parent.mkdir(parents=True,exist_ok=True); Path(a.output).write_text(json.dumps(out,indent=2),encoding="utf-8"); print(json.dumps(out)); return 0 if status=="verified" else 1
if __name__=="__main__": raise SystemExit(main())
