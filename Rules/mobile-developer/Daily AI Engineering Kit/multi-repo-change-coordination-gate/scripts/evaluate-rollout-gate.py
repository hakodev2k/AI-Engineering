#!/usr/bin/env python3
import argparse, hashlib, json, sys

def canon(x): return json.dumps(x,sort_keys=True,separators=(",",":"),ensure_ascii=False)
def fp(x): return hashlib.sha256(canon(x).encode()).hexdigest()

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("plan"); ap.add_argument("--review"); ap.add_argument("--output"); a=ap.parse_args()
    try: plan=json.load(open(a.plan,encoding="utf-8"))
    except Exception as e: print(f"load error: {e}",file=sys.stderr); return 2
    reasons=[]; status="verified"; risk=plan.get("risk")
    for r in plan.get("repositories",[]):
        if r.get("state") in {"blocked","planned"}: reasons.append(f"repo not ready: {r.get('name')}={r.get('state')}")
        if not r.get("verification"): reasons.append(f"missing verification evidence: {r.get('name')}")
    for e in plan.get("edges",[]):
        if e.get("compatibility")=="unknown": reasons.append(f"unknown compatibility: {e.get('from')}->{e.get('to')}")
    review=None
    if a.review:
        try: review=json.load(open(a.review,encoding="utf-8"))
        except Exception as e: reasons.append(f"review load failed: {e}")
    if risk in {"high","critical"}:
        if not review: status="review-required"; reasons.append("independent review required")
        else:
            if not review.get("independent"): status="blocked"; reasons.append("high-risk review is not independent")
            if review.get("decision")!="approved": status="blocked"; reasons.append("review decision is not approved")
            if review.get("plan_fingerprint")!=fp(plan): status="blocked"; reasons.append("review fingerprint is stale")
    if reasons and status=="verified": status="blocked"
    approval_actions={"production-deploy","breaking-contract-change","database-schema-change","destructive-data-change","force-push","infrastructure-change","secret-change","production-config-change","security-control-weakening","irreversible-migration","large-dependency-upgrade"}
    requested=set()
    for r in plan.get("repositories",[]): requested.update(r.get("approval_actions",[]))
    if requested & approval_actions and not plan.get("approvals"):
        if status!="blocked": status="approval-required"
        reasons.append("approval-required action has no approval evidence")
    result={"status":status,"plan_fingerprint":fp(plan),"reasons":reasons}
    text=json.dumps(result,indent=2)
    if a.output: open(a.output,"w",encoding="utf-8").write(text+"\n")
    else: print(text)
    return 0 if status=="verified" else 4
if __name__=="__main__": raise SystemExit(main())
