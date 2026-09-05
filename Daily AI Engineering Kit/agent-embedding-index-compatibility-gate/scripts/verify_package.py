#!/usr/bin/env python3
import json,subprocess,sys
from pathlib import Path
R=Path(__file__).resolve().parents[1]
REQ=["README.md","config/policy.json","schemas/embedding-manifest.schema.json","schemas/compatibility-report.schema.json","scripts/check_embedding_compat.py","scripts/check_vector_samples.py","scripts/verify_package.py","skills/discover-embedding-contract.md","skills/plan-safe-reindex.md","rules/embedding-index-safety.md","subagents/embedding-explorer.md","subagents/reindex-planner.md","subagents/verification-agent.md","workflows/embedding-index-compatibility.md","hooks/pre-change.md","hooks/post-change.md","examples/baseline-manifest.json","examples/candidate-compatible.json","examples/candidate-breaking.json","examples/sample-vectors.json","tests/test_embedding_compat.py"]
def main():
    miss=[x for x in REQ if not (R/x).is_file()]
    if miss: print("missing:\n"+"\n".join(miss),file=sys.stderr);return 1
    for x in [p for p in REQ if p.endswith(".json")]: json.loads((R/x).read_text())
    t=subprocess.run([sys.executable,"-m","unittest","discover","-s","tests","-p","test_*.py"],cwd=R)
    if t.returncode:return t.returncode
    out=R/".compat.json"
    a=subprocess.run([sys.executable,str(R/"scripts/check_embedding_compat.py"),"--baseline",str(R/"examples/baseline-manifest.json"),"--candidate",str(R/"examples/candidate-compatible.json"),"--output",str(out)],cwd=R)
    b=subprocess.run([sys.executable,str(R/"scripts/check_vector_samples.py"),"--manifest",str(R/"examples/baseline-manifest.json"),"--vectors",str(R/"examples/sample-vectors.json")],cwd=R)
    ok=a.returncode==0 and b.returncode==0 and json.loads(out.read_text())["status"]=="pass";out.unlink(missing_ok=True)
    print("Package verification passed." if ok else "Package verification failed.");return 0 if ok else 1
if __name__=="__main__":raise SystemExit(main())
