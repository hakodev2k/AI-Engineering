#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
POLICY=ROOT/"config/provenance-policy.json"
VALIDATE=ROOT/"scripts/validate-provenance.py"
GATE=ROOT/"scripts/evaluate-provenance-gate.py"

def run(cmd): return subprocess.run(cmd,capture_output=True,text=True)

def main():
    with tempfile.TemporaryDirectory() as td:
        td=Path(td)
        diff={"version":1,"baseline_ref":"main","diff_sha256":"a"*64,"files":[{"path":"src/a.cs","status":"M","additions":"1","deletions":"1"}]}
        record={
          "version":1,"task":{"id":"T","title":"x","implementation_owner":"impl"},"baseline_ref":"main","diff_sha256":"a"*64,
          "allowed_scope":["src/**"],"requirements":[{"id":"R1","text":"x"}],"evidence":[{"id":"E1","source":"test","summary":"x"}],
          "changes":[{"path":"src/a.cs","classification":"requirement","rationale":"required","requirement_ids":["R1"],"evidence_ids":["E1"],"verification_checks":[{"id":"tests","status":"passed","owner":"qa"}],"risk_tags":[]}],
          "human_approval":None,"review":{"reviewer":"reviewer","decision":"pass","findings":[]}}
        dp=td/"diff.json"; rp=td/"record.json"; dp.write_text(json.dumps(diff)); rp.write_text(json.dumps(record))
        if run([sys.executable,str(VALIDATE),"--record",str(rp),"--diff",str(dp),"--policy",str(POLICY)]).returncode!=0: return 1
        if run([sys.executable,str(GATE),"--record",str(rp),"--diff",str(dp),"--policy",str(POLICY)]).returncode!=0: return 2
        record["changes"][0]["risk_tags"]=["deletion"]; rp.write_text(json.dumps(record))
        if run([sys.executable,str(GATE),"--record",str(rp),"--diff",str(dp),"--policy",str(POLICY)]).returncode!=3: return 3
        record["changes"][0]["path"]="outside/a.cs"; rp.write_text(json.dumps(record))
        if run([sys.executable,str(VALIDATE),"--record",str(rp),"--diff",str(dp),"--policy",str(POLICY)]).returncode==0: return 4
    print("smoke test passed"); return 0

if __name__=="__main__": raise SystemExit(main())
