#!/usr/bin/env python3
import json, os, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PY=sys.executable

def run(args, expected):
    p=subprocess.run([PY,*args],cwd=ROOT,text=True,capture_output=True)
    if p.returncode!=expected:
        raise SystemExit(f"command failed: {' '.join(args)}\nexpected={expected} actual={p.returncode}\nstdout={p.stdout}\nstderr={p.stderr}")

def write(path,obj):
    path.write_text(json.dumps(obj,indent=2),encoding="utf-8")

def snapshot(kind, producer, feature=True, fp="fp-a"):
    return {
      "application":"demo-api","environment":"staging","snapshot_kind":kind,"producer":producer,
      "generated_at":"2026-08-17T07:30:00+00:00","sources":["demo-source"],
      "entries":[
        {"key":"Feature.Enabled","classification":"public","required":True,"present":True,"source":"demo-source","value_type":"boolean","value":feature},
        {"key":"Database.Password","classification":"secret","required":True,"present":True,"source":"secret-store","value_type":"string","fingerprint":fp}
      ]}

def main():
    policy="config/drift-policy.json"
    with tempfile.TemporaryDirectory() as td:
        d=Path(td); exp=d/"expected.json"; runtime=d/"runtime.json"; report=d/"report.json"; review=d/"review.json"; gate=d/"gate.json"
        write(exp,snapshot("expected","baseline-agent")); write(runtime,snapshot("runtime","collector-agent")); write(review,{"reviewer":"review-agent","status":"verified","exceptions":[]})
        run(["scripts/validate-config-snapshot.py","--snapshot",str(exp),"--policy",policy],0)
        run(["scripts/validate-config-snapshot.py","--snapshot",str(runtime),"--policy",policy],0)
        run(["scripts/compare-config-snapshots.py","--expected",str(exp),"--runtime",str(runtime),"--policy",policy,"--output",str(report)],0)
        run(["scripts/evaluate-drift-gate.py","--report",str(report),"--policy",policy,"--review",str(review),"--output",str(gate)],0)
        if json.loads(gate.read_text())["decision"]!="pass": raise SystemExit("clean case did not pass")
        write(runtime,snapshot("runtime","collector-agent",fp="fp-b"))
        run(["scripts/compare-config-snapshots.py","--expected",str(exp),"--runtime",str(runtime),"--policy",policy,"--output",str(report)],0)
        run(["scripts/evaluate-drift-gate.py","--report",str(report),"--policy",policy,"--review",str(review),"--output",str(gate)],3)
        if json.loads(gate.read_text())["decision"]!="human-approval-required": raise SystemExit("critical secret drift did not require approval")
    print("runtime-config-drift-gate smoke test passed")
    return 0

if __name__=="__main__": raise SystemExit(main())
