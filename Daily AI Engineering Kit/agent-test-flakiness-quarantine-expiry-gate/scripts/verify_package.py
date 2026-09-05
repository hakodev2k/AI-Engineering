#!/usr/bin/env python3
import json,subprocess,sys
from pathlib import Path
R=Path(__file__).resolve().parents[1]
REQ=["README.md","config/quarantine-policy.json","schemas/quarantine.schema.json","schemas/gate-report.schema.json","scripts/quarantine_gate.py","scripts/verify_package.py","skills/prove-flakiness.md","skills/quarantine-remediation.md","rules/test-quarantine-safety.md","subagents/flakiness-investigator.md","subagents/remediation-planner.md","subagents/verification-agent.md","workflows/quarantine-lifecycle.md","hooks/pre-quarantine.md","hooks/pre-merge.md","examples/quarantine.json","examples/flaky-runs.json","tests/test_quarantine_gate.py"]
def main():
    missing=[p for p in REQ if not (R/p).is_file()]
    if missing: print("missing files:\n"+"\n".join(missing),file=sys.stderr); return 1
    for p in ["config/quarantine-policy.json","schemas/quarantine.schema.json","schemas/gate-report.schema.json","examples/quarantine.json","examples/flaky-runs.json"]: json.loads((R/p).read_text(encoding="utf-8"))
    t=subprocess.run([sys.executable,"-m","unittest","discover","-s","tests","-p","test_*.py"],cwd=R)
    if t.returncode: return t.returncode
    out=R/".verify-report.json"
    g=subprocess.run([sys.executable,str(R/"scripts/quarantine_gate.py"),"--registry",str(R/"examples/quarantine.json"),"--policy",str(R/"config/quarantine-policy.json"),"--report",str(out),"--now","2026-09-06T00:00:00Z"],cwd=R)
    if g.returncode: return g.returncode
    report=json.loads(out.read_text()); out.unlink(missing_ok=True)
    if report["status"]!="pass": return 1
    print("Package verification passed."); return 0
if __name__=="__main__": raise SystemExit(main())
