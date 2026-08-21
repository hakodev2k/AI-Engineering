#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from datetime import datetime, timezone
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
PY=sys.executable

def run(args, ok=True):
    p=subprocess.run([PY,*args],cwd=ROOT,text=True,capture_output=True)
    if ok and p.returncode!=0: raise AssertionError(p.stderr or p.stdout)
    if not ok and p.returncode==0: raise AssertionError("expected failure")
    return p

def main():
    with tempfile.TemporaryDirectory() as td:
        d=Path(td); rev="a"*40; base="b"*40; fp="c"*64; now=datetime.now(timezone.utc).isoformat()
        e={"version":1,"evidence_id":"unit","category":"unit","command":"test","status":"passed","source_revision":rev,"base_revision":base,"input_fingerprint":fp,"environment_fingerprint":None,"observed_at":now,"duration_ms":1,"artifacts":[],"notes":[]}
        ep=d/"e.json"; ep.write_text(json.dumps(e))
        ev=d/"ev.json"; run(["scripts/evaluate-freshness.py","--evidence",str(ep),"--policy","config/freshness-policy.json","--current-revision",rev,"--current-base-revision",base,"--current-input-fingerprint",fp,"--output",str(ev)])
        out=json.loads(ev.read_text()); assert out["status"]=="fresh"
        run(["scripts/evaluate-freshness.py","--evidence",str(ep),"--policy","config/freshness-policy.json","--current-revision","d"*40,"--current-base-revision",base,"--current-input-fingerprint",fp],ok=False)
        run(["scripts/evaluate-freshness.py","--evidence",str(ep),"--policy","config/freshness-policy.json","--current-revision",rev,"--current-base-revision",base,"--current-input-fingerprint","e"*64],ok=False)
        gate=d/"gate.json"; run(["scripts/evaluate-final-gate.py","--evaluation",str(ev),"--policy","config/freshness-policy.json","--output",str(gate)])
        assert json.loads(gate.read_text())["status"]=="verified"
        high=dict(e); high["evidence_id"]="security"; high["category"]="security"; hp=d/"h.json"; hp.write_text(json.dumps(high)); hev=d/"hev.json"; run(["scripts/evaluate-freshness.py","--evidence",str(hp),"--policy","config/freshness-policy.json","--current-revision",rev,"--current-base-revision",base,"--current-input-fingerprint",fp,"--output",str(hev)])
        run(["scripts/evaluate-final-gate.py","--evaluation",str(hev),"--policy","config/freshness-policy.json"],ok=False)
    print("smoke tests passed")
if __name__=="__main__": main()