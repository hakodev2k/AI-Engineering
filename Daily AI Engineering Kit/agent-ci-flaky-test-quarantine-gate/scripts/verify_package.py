#!/usr/bin/env python3
from __future__ import annotations
import json, subprocess, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REQUIRED=[
"README.md","config/flaky-test-policy.json","config/quarantine.json","schemas/history.schema.json","schemas/quarantine.schema.json",
"scripts/flaky_test_gate.py","scripts/verify_package.py","skills/classify-flakiness.md","skills/root-cause-flaky-test.md","skills/plan-quarantine.md",
"rules/flaky-test-safety.md","subagents/test-investigator.md","subagents/quarantine-reviewer.md","subagents/verification-agent.md",
"workflows/flaky-test-quarantine.md","hooks/pre-change.md","hooks/post-change.md","examples/history.json","examples/quarantine.example.json","tests/test_flaky_test_gate.py"]

def main()->int:
    missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
    if missing:
        print("missing files:\n"+"\n".join(missing),file=sys.stderr); return 1
    for p in ["config/flaky-test-policy.json","config/quarantine.json","schemas/history.schema.json","schemas/quarantine.schema.json","examples/history.json","examples/quarantine.example.json"]:
        json.loads((ROOT/p).read_text(encoding="utf-8"))
    t=subprocess.run([sys.executable,"-m","unittest","discover","-s","tests","-p","test_*.py"],cwd=ROOT,check=False)
    if t.returncode: return t.returncode
    out=ROOT/".verify-report.json"
    g=subprocess.run([sys.executable,str(ROOT/"scripts/flaky_test_gate.py"),"--history",str(ROOT/"examples/history.json"),"--quarantine",str(ROOT/"config/quarantine.json"),"--policy",str(ROOT/"config/flaky-test-policy.json"),"--output",str(out),"--now","2026-09-06T00:00:00+07:00"],cwd=ROOT,check=False)
    if g.returncode != 0:
        return g.returncode
    report=json.loads(out.read_text(encoding="utf-8")); out.unlink(missing_ok=True)
    if report["summary"]["review"] < 1:
        print("example should identify at least one flaky candidate for review",file=sys.stderr); return 1
    print("Package verification passed."); return 0
if __name__=="__main__": raise SystemExit(main())
