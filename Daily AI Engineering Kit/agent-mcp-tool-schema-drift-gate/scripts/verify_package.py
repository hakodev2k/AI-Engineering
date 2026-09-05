#!/usr/bin/env python3
import json,subprocess,sys
from pathlib import Path
R=Path(__file__).resolve().parents[1]
REQ=["README.md","config/policy.json","schemas/report.schema.json","scripts/mcp_schema_gate.py","scripts/verify_package.py","skills/investigate-schema-drift.md","skills/plan-compatible-migration.md","rules/mcp-contract-safety.md","subagents/contract-explorer.md","subagents/migration-planner.md","subagents/verification-agent.md","workflows/mcp-schema-drift.md","hooks/pre-change.md","hooks/post-change.md","examples/baseline.json","examples/candidate-breaking.json","tests/test_mcp_schema_gate.py"]
def main():
    missing=[p for p in REQ if not (R/p).is_file()]
    if missing: print("missing:\n"+"\n".join(missing),file=sys.stderr);return 1
    for p in ["config/policy.json","schemas/report.schema.json","examples/baseline.json","examples/candidate-breaking.json"]: json.loads((R/p).read_text())
    t=subprocess.run([sys.executable,"-m","unittest","discover","-s","tests","-p","test_*.py"],cwd=R)
    if t.returncode:return t.returncode
    out=R/".gate-report.json"
    g=subprocess.run([sys.executable,str(R/"scripts/mcp_schema_gate.py"),"--baseline",str(R/"examples/baseline.json"),"--candidate",str(R/"examples/candidate-breaking.json"),"--output",str(out)],cwd=R)
    if g.returncode!=1:return 1
    r=json.loads(out.read_text());out.unlink(missing_ok=True)
    if r["summary"]["breaking"]<1:return 1
    print("Package verification passed.");return 0
if __name__=="__main__":raise SystemExit(main())
