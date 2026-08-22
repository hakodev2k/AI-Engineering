#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load(p): return json.loads(Path(p).read_text(encoding="utf-8"))
def main():
    p=argparse.ArgumentParser(); p.add_argument("--evaluation", action="append", required=True); p.add_argument("--policy",required=True); p.add_argument("--review"); p.add_argument("--actors",default=""); p.add_argument("--output")
    a=p.parse_args(); policy=load(a.policy); evaluations=[load(x) for x in a.evaluation]; reasons=[]
    stale=[e.get("evidence_id") for e in evaluations if e.get("status")!="fresh"]
    if stale: reasons.append("stale-evidence:"+",".join(str(x) for x in stale))
    high=[e for e in evaluations if e.get("category") in policy.get("high_risk_categories",[])]
    if high and policy.get("high_risk_requires_independent_review",True):
        if not a.review: reasons.append("independent-review-required")
        else:
            r=load(a.review); fps={e.get("evaluation_fingerprint") for e in high}; actors={x.strip() for x in a.actors.split(",") if x.strip()}
            if r.get("status")!="approved": reasons.append("review-not-approved")
            if r.get("evaluation_fingerprint") not in fps and len(fps)==1: reasons.append("review-fingerprint-mismatch")
            if r.get("reviewer") in actors: reasons.append("reviewer-not-independent")
            if high and r.get("reviewed_revision")!=high[0].get("current_revision"): reasons.append("review-revision-mismatch")
    out={"status":"verified" if not reasons else "blocked","reasons":reasons,"evidence_count":len(evaluations)}; text=json.dumps(out,indent=2)
    Path(a.output).write_text(text+"\n",encoding="utf-8") if a.output else print(text)
    return 0 if not reasons else 2
if __name__=="__main__":
    try: raise SystemExit(main())
    except (OSError,ValueError,json.JSONDecodeError) as ex: print(f"error: {ex}",file=sys.stderr); raise SystemExit(1)