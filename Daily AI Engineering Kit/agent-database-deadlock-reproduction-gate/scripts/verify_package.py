#!/usr/bin/env python3
import json, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
REQ = [
"README.md","config/policy.json","schemas/deadlock-capture.schema.json","schemas/deadlock-report.schema.json",
"scripts/deadlock_gate.py","scripts/verify_package.py","skills/reproduce-deadlock.md","skills/plan-lock-order-fix.md",
"rules/database-deadlock-safety.md","subagents/deadlock-investigator.md","subagents/fix-planner.md","subagents/verification-agent.md",
"workflows/deadlock-reproduction.md","hooks/pre-change.md","hooks/post-change.md","examples/baseline-deadlock.json","examples/candidate-clean.json","tests/test_deadlock_gate.py"]

def main():
    missing=[p for p in REQ if not (ROOT/p).is_file()]
    if missing:
        print("missing files:\n"+"\n".join(missing),file=sys.stderr); return 1
    for p in ["config/policy.json","schemas/deadlock-capture.schema.json","schemas/deadlock-report.schema.json","examples/baseline-deadlock.json","examples/candidate-clean.json"]:
        json.loads((ROOT/p).read_text(encoding="utf-8"))
    t=subprocess.run([sys.executable,"-m","unittest","discover","-s","tests","-p","test_*.py"],cwd=ROOT)
    if t.returncode: return t.returncode
    out=ROOT/".verify-report.json"
    g=subprocess.run([sys.executable,str(ROOT/"scripts/deadlock_gate.py"),"--baseline",str(ROOT/"examples/baseline-deadlock.json"),"--candidate",str(ROOT/"examples/candidate-clean.json"),"--output",str(out),"--min-candidate-runs","3"],cwd=ROOT)
    if g.returncode != 0: return 1
    report=json.loads(out.read_text(encoding="utf-8")); out.unlink(missing_ok=True)
    if report["status"] != "pass" or report["baseline"]["deadlock_runs"] < 1 or report["candidate"]["deadlock_runs"] != 0: return 1
    print("Package verification passed."); return 0
if __name__ == "__main__": raise SystemExit(main())
