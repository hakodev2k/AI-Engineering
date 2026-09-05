#!/usr/bin/env python3
import json, subprocess, sys
from pathlib import Path
R=Path(__file__).resolve().parents[1]
REQ=["README.md","config/policy.json","schemas/trace-event.schema.json","schemas/report.schema.json","scripts/idempotency_gate.py","scripts/verify_package.py","skills/classify-tool-risk.md","skills/investigate-ambiguous-outcome.md","rules/idempotency-safety.md","subagents/execution-planner.md","subagents/replay-verifier.md","workflows/idempotent-tool-execution.md","hooks/pre-tool-call.md","hooks/post-tool-call.md","templates/tool-call-envelope.json","examples/trace-safe.jsonl","examples/trace-duplicate.jsonl","tests/test_idempotency_gate.py"]
def run(trace,expected):
    out=R/".verify-report.json"
    p=subprocess.run([sys.executable,str(R/"scripts/idempotency_gate.py"),"--trace",str(R/trace),"--policy",str(R/"config/policy.json"),"--output",str(out)],cwd=R)
    if p.returncode!=expected: return False
    json.loads(out.read_text());out.unlink(missing_ok=True);return True
def main():
    missing=[x for x in REQ if not (R/x).is_file()]
    if missing: print("missing files:\n"+"\n".join(missing),file=sys.stderr);return 1
    for x in ["config/policy.json","schemas/trace-event.schema.json","schemas/report.schema.json","templates/tool-call-envelope.json"]: json.loads((R/x).read_text())
    t=subprocess.run([sys.executable,"-m","unittest","discover","-s","tests","-p","test_*.py"],cwd=R)
    if t.returncode:return t.returncode
    if not run("examples/trace-safe.jsonl",0): return 1
    if not run("examples/trace-duplicate.jsonl",1): return 1
    print("Package verification passed.");return 0
if __name__=="__main__":raise SystemExit(main())
