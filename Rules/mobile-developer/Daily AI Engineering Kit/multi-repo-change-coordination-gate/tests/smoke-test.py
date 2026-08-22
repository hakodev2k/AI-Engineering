#!/usr/bin/env python3
import hashlib, json, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPTS=ROOT/"scripts"

def write(p,obj): p.write_text(json.dumps(obj,indent=2),encoding="utf-8")
def run(*args): return subprocess.run([sys.executable,*map(str,args)],capture_output=True,text=True)
def fp(obj): return hashlib.sha256(json.dumps(obj,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()

def base_plan():
    return {
      "plan_id":"smoke","risk":"low",
      "repositories":[
        {"name":"api","revision":"aaaaaaa","role":"producer","state":"ready","changes":["add field"],"verification":["contract pass"]},
        {"name":"client","revision":"bbbbbbb","role":"consumer","state":"ready","changes":["read field"],"verification":["consumer pass"]}
      ],
      "edges":[{"from":"api","to":"client","contract":"item schema","compatibility":"requires-ordering"}],
      "rollout":["api","client"],"rollback":["client","api"],"approvals":[]
    }

def main():
    failures=[]
    with tempfile.TemporaryDirectory() as d:
        d=Path(d)
        p=base_plan(); pp=d/"plan.json"; write(pp,p)
        if run(SCRIPTS/"validate-change-plan.py",pp).returncode!=0: failures.append("valid plan rejected")
        gate=run(SCRIPTS/"evaluate-rollout-gate.py",pp)
        if gate.returncode!=0 or json.loads(gate.stdout)["status"]!="verified": failures.append("ready low-risk plan not verified")

        unknown=base_plan(); unknown["edges"][0]["compatibility"]="unknown"; up=d/"unknown.json"; write(up,unknown)
        ug=run(SCRIPTS/"evaluate-rollout-gate.py",up)
        if ug.returncode==0 or json.loads(ug.stdout)["status"]!="blocked": failures.append("unknown compatibility not blocked")

        bad=base_plan(); bad["rollout"]=["client","api"]; bp=d/"bad.json"; write(bp,bad)
        if run(SCRIPTS/"validate-change-plan.py",bp).returncode==0: failures.append("bad ordering accepted")

        high=base_plan(); high["risk"]="high"; hp=d/"high.json"; write(hp,high)
        review={"plan_id":"smoke","reviewer":"implementer","independent":False,"decision":"approved","plan_fingerprint":fp(high),"evidence":["self review"]}
        rp=d/"review.json"; write(rp,review)
        hg=run(SCRIPTS/"evaluate-rollout-gate.py",hp,"--review",rp)
        if hg.returncode==0 or json.loads(hg.stdout)["status"]!="blocked": failures.append("high-risk self-review not blocked")

    if failures:
        print(json.dumps({"status":"failed","failures":failures},indent=2)); return 1
    print(json.dumps({"status":"passed","cases":4},indent=2)); return 0

if __name__=="__main__": raise SystemExit(main())
