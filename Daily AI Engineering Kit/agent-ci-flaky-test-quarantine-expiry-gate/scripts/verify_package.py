#!/usr/bin/env python3
import json, subprocess, sys
from pathlib import Path
R=Path(__file__).resolve().parents[1]
REQ=["README.md","config/policy.json","config/quarantines.json","schemas/quarantine.schema.json","scripts/quarantine_gate.py","scripts/record_quarantine.py","scripts/verify_package.py","skills/flaky-test-investigation.md","skills/quarantine-decision.md","rules/quarantine-safety.md","subagents/flaky-test-investigator.md","subagents/quarantine-reviewer.md","subagents/verification-agent.md","workflows/flaky-test-quarantine.md","hooks/pre-quarantine.md","hooks/ci-quarantine-gate.md","examples/history.json","tests/test_quarantine_gate.py"]
def main():
    missing=[p for p in REQ if not (R/p).is_file()]
    if missing: print("missing:\n"+"\n".join(missing),file=sys.stderr); return 1
    for p in ["config/policy.json","config/quarantines.json","schemas/quarantine.schema.json","examples/history.json"]: json.loads((R/p).read_text(encoding="utf-8"))
    t=subprocess.run([sys.executable,"-m","unittest","discover","-s","tests","-p","test_*.py"],cwd=R)
    if t.returncode: return t.returncode
    g=subprocess.run([sys.executable,str(R/"scripts/quarantine_gate.py"),"--registry",str(R/"config/quarantines.json"),"--policy",str(R/"config/policy.json"),"--today","2026-09-05"],cwd=R)
    if g.returncode: return g.returncode
    print("package verification passed"); return 0
if __name__=="__main__": raise SystemExit(main())
