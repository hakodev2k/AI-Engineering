#!/usr/bin/env python3
import argparse, json, sys

def main():
    p=argparse.ArgumentParser(); p.add_argument("comparison"); p.add_argument("--review"); p.add_argument("--policy",required=True); p.add_argument("--output",required=True); a=p.parse_args()
    comp=json.load(open(a.comparison,encoding="utf-8")); pol=json.load(open(a.policy,encoding="utf-8")); review=json.load(open(a.review,encoding="utf-8")) if a.review else None
    status="verified"; reasons=[]
    if comp["status"]=="blocked":
        status="blocked"; reasons.extend(comp.get("blockers",[]))
    elif comp["status"]=="review-required":
        status="review-required"; reasons.extend(comp.get("warnings",[]))

    needs_independent=comp.get("risk") in pol.get("review",{}).get("independent_review_for",[])

    # Deterministic blockers cannot be overridden by a review. Remediate and recapture,
    # or change policy through a separate governed process.
    if status != "blocked" and status == "review-required":
        if not review:
            reasons.append("review-missing")
        else:
            if review.get("comparison_fingerprint") != comp.get("comparison_fingerprint"):
                status="blocked"; reasons.append("stale-review-fingerprint")
            if needs_independent and not pol["review"].get("allow_self_review",False) and review.get("reviewer") in ("implementer","agent-implementer"):
                status="blocked"; reasons.append("self-review-not-allowed")
            if review.get("status") in ("changes-required","blocked"):
                status="blocked"; reasons.append("review-not-approved")
            elif review.get("status")=="approved" and status=="review-required":
                status="verified"

    out={"status":status,"comparison_fingerprint":comp.get("comparison_fingerprint"),"risk":comp.get("risk"),"reasons":sorted(set(reasons)),"task_executed":True,"task_verified":status=="verified"}
    json.dump(out,open(a.output,"w",encoding="utf-8"),indent=2); print(status)
    sys.exit(0 if status=="verified" else 2)
if __name__=="__main__": main()
