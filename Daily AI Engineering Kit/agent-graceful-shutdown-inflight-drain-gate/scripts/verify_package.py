#!/usr/bin/env python3
import json, subprocess, sys
from pathlib import Path
R=Path(__file__).resolve().parents[1]
REQ=["README.md","skills/shutdown-discovery.md","skills/drain-design.md","skills/failure-recovery.md","rules/shutdown-safety.md","subagents/lifecycle-explorer.md","subagents/drain-planner.md","subagents/verification-agent.md","workflows/graceful-shutdown.md","hooks/pre-change.md","hooks/post-change.md","scripts/shutdown_drain_gate.py","scripts/verify_package.py","config/drain-policy.json","schemas/shutdown-snapshot.schema.json","schemas/gate-report.schema.json","examples/baseline.json","examples/candidate-safe.json","examples/candidate-unsafe.json","tests/test_shutdown_drain_gate.py"]
def main()->int:
    missing=[p for p in REQ if not (R/p).is_file()]
    if missing: print("missing:\n"+"\n".join(missing),file=sys.stderr); return 1
    for p in ["config/drain-policy.json","schemas/shutdown-snapshot.schema.json","schemas/gate-report.schema.json","examples/baseline.json","examples/candidate-safe.json","examples/candidate-unsafe.json"]: json.loads((R/p).read_text(encoding="utf-8"))
    t=subprocess.run([sys.executable,"-m","unittest","discover","-s","tests","-p","test_*.py"],cwd=R,check=False)
    if t.returncode: return t.returncode
    for candidate,expected in [("candidate-safe.json",0),("candidate-unsafe.json",1)]:
        out=R/("."+candidate+".report.json")
        g=subprocess.run([sys.executable,str(R/"scripts/shutdown_drain_gate.py"),"--snapshot",str(R/"examples"/candidate),"--policy",str(R/"config/drain-policy.json"),"--output",str(out)],cwd=R,check=False)
        if g.returncode!=expected: return 1
        report=json.loads(out.read_text(encoding="utf-8")); out.unlink(missing_ok=True)
        if expected==0 and report["status"]!="pass": return 1
        if expected==1 and report["summary"]["blocking"]<1: return 1
    print("Package verification passed."); return 0
if __name__=="__main__": raise SystemExit(main())
