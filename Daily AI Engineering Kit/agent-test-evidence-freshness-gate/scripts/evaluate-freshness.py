#!/usr/bin/env python3
import argparse, hashlib, json, sys
from datetime import datetime, timezone
from pathlib import Path

def load(p): return json.loads(Path(p).read_text(encoding="utf-8"))
def canon(v): return json.dumps(v,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()
def dt(s):
    x=datetime.fromisoformat(s.replace("Z","+00:00"));
    if x.tzinfo is None: raise ValueError("observed_at must include timezone")
    return x.astimezone(timezone.utc)
def main():
    p=argparse.ArgumentParser(); p.add_argument("--evidence",required=True); p.add_argument("--policy",required=True); p.add_argument("--current-revision",required=True); p.add_argument("--current-base-revision",required=True); p.add_argument("--current-input-fingerprint",required=True); p.add_argument("--current-environment-fingerprint"); p.add_argument("--now"); p.add_argument("--output")
    a=p.parse_args(); e=load(a.evidence); policy=load(a.policy); reasons=[]
    now=dt(a.now) if a.now else datetime.now(timezone.utc); age=max(0,(now-dt(e["observed_at"])).total_seconds())
    if e.get("status")!="passed": reasons.append("evidence-not-passed")
    if policy.get("require_exact_revision",True) and e.get("source_revision")!=a.current_revision: reasons.append("stale-source-revision")
    if e.get("base_revision")!=a.current_base_revision: reasons.append("stale-base-revision")
    if policy.get("require_input_fingerprint",True) and e.get("input_fingerprint")!=a.current_input_fingerprint: reasons.append("stale-input-fingerprint")
    if age>int(policy.get("max_evidence_age_seconds",3600)): reasons.append("evidence-too-old")
    if e.get("category") in policy.get("require_environment_fingerprint_for",[]):
        if not a.current_environment_fingerprint or e.get("environment_fingerprint")!=a.current_environment_fingerprint: reasons.append("stale-or-missing-environment-fingerprint")
    status="fresh" if not reasons else "stale"
    core={"evidence_id":e.get("evidence_id"),"category":e.get("category"),"status":status,"reasons":reasons,"age_seconds":int(age),"current_revision":a.current_revision,"current_base_revision":a.current_base_revision,"current_input_fingerprint":a.current_input_fingerprint,"policy":policy}
    core["evaluation_fingerprint"]=hashlib.sha256(canon(core)).hexdigest(); text=json.dumps(core,indent=2)
    Path(a.output).write_text(text+"\n",encoding="utf-8") if a.output else print(text)
    return 0 if status=="fresh" else 2
if __name__=="__main__":
    try: raise SystemExit(main())
    except (OSError,KeyError,ValueError,json.JSONDecodeError) as ex: print(f"error: {ex}",file=sys.stderr); raise SystemExit(1)