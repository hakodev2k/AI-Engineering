#!/usr/bin/env python3
import json, subprocess, sys
from pathlib import Path
R=Path(__file__).resolve().parents[1]
REQ=["README.md","config/policy.json","schemas/output-contract.schema.json","schemas/repair-request.schema.json","schemas/validation-report.schema.json","scripts/validate_output.py","scripts/build_repair_request.py","scripts/verify_package.py","skills/validate-structured-output.md","skills/repair-structured-output.md","rules/structured-output-safety.md","subagents/output-investigator.md","subagents/repair-agent.md","subagents/verification-agent.md","workflows/structured-output-repair.md","hooks/pre-consume.md","hooks/post-repair.md","examples/valid-output.json","examples/invalid-output.json","examples/expected-contract.json","tests/test_validate_output.py"]
def main():
    miss=[x for x in REQ if not (R/x).is_file()]
    if miss: print("missing:\n"+"\n".join(miss),file=sys.stderr); return 1
    for x in [p for p in REQ if p.endswith(".json")]: json.loads((R/x).read_text(encoding="utf-8"))
    t=subprocess.run([sys.executable,"-m","unittest","discover","-s","tests","-p","test_*.py"],cwd=R)
    if t.returncode: return t.returncode
    rv=R/".valid-report.json"; ri=R/".invalid-report.json"
    a=subprocess.run([sys.executable,str(R/"scripts/validate_output.py"),"--input",str(R/"examples/valid-output.json"),"--schema",str(R/"schemas/output-contract.schema.json"),"--report",str(rv)],cwd=R)
    b=subprocess.run([sys.executable,str(R/"scripts/validate_output.py"),"--input",str(R/"examples/invalid-output.json"),"--schema",str(R/"schemas/output-contract.schema.json"),"--report",str(ri)],cwd=R)
    ok=a.returncode==0 and b.returncode==1 and json.loads(rv.read_text())["status"]=="valid" and json.loads(ri.read_text())["status"]=="invalid"
    rv.unlink(missing_ok=True); ri.unlink(missing_ok=True)
    print("Package verification passed." if ok else "Package verification failed."); return 0 if ok else 1
if __name__=="__main__": raise SystemExit(main())
