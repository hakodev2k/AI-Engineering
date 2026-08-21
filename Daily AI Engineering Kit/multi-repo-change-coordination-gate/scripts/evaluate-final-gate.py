#!/usr/bin/env python3
import argparse, json, sys

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("plan"); ap.add_argument("rollout_result"); ap.add_argument("--current-revisions"); ap.add_argument("--output"); a=ap.parse_args()
    try:
        plan=json.load(open(a.plan,encoding="utf-8")); gate=json.load(open(a.rollout_result,encoding="utf-8"))
    except Exception as e:
        print(f"load error: {e}",file=sys.stderr); return 2
    reasons=[]
    if gate.get("status")!="verified": reasons.append(f"rollout gate is {gate.get('status')}")
    repos={r["name"]:r for r in plan.get("repositories",[]) if "name" in r}
    for n,r in repos.items():
        if r.get("state")!="verified": reasons.append(f"repository not verified: {n}={r.get('state')}")
        if not r.get("verification"): reasons.append(f"repository has no verification evidence: {n}")
    if a.current_revisions:
        try: current=json.load(open(a.current_revisions,encoding="utf-8"))
        except Exception as e: reasons.append(f"current revisions load failed: {e}"); current={}
        for n,r in repos.items():
            if current.get(n)!=r.get("revision"): reasons.append(f"revision drift: {n}")
    result={"status":"verified" if not reasons else "blocked","reasons":reasons}
    text=json.dumps(result,indent=2)
    if a.output: open(a.output,"w",encoding="utf-8").write(text+"\n")
    else: print(text)
    return 0 if not reasons else 5
if __name__=="__main__": raise SystemExit(main())
