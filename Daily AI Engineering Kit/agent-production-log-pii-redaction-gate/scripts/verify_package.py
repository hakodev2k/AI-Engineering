#!/usr/bin/env python3
import json, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
REQ = ["README.md","config/redaction-policy.json","schemas/redaction-report.schema.json","scripts/log_redaction_gate.py","scripts/verify_package.py","skills/discover-log-exposure.md","skills/implement-redaction.md","rules/log-data-safety.md","subagents/log-exposure-explorer.md","subagents/redaction-planner.md","subagents/verification-agent.md","workflows/log-redaction-gate.md","hooks/pre-change.md","hooks/post-change.md","examples/safe.log","examples/unsafe.log","tests/test_log_redaction_gate.py"]
def main():
    missing=[p for p in REQ if not (ROOT/p).is_file()]
    if missing: print("missing files:\n"+"\n".join(missing), file=sys.stderr); return 1
    for p in ["config/redaction-policy.json","schemas/redaction-report.schema.json"]: json.loads((ROOT/p).read_text(encoding="utf-8"))
    tests=subprocess.run([sys.executable,"-m","unittest","discover","-s","tests","-p","test_*.py"],cwd=ROOT)
    if tests.returncode: return tests.returncode
    safe=ROOT/".safe-report.json"; unsafe=ROOT/".unsafe-report.json"
    cmd=[sys.executable,str(ROOT/"scripts/log_redaction_gate.py"),"--policy",str(ROOT/"config/redaction-policy.json")]
    s=subprocess.run(cmd+["--input",str(ROOT/"examples/safe.log"),"--output",str(safe)],cwd=ROOT)
    u=subprocess.run(cmd+["--input",str(ROOT/"examples/unsafe.log"),"--output",str(unsafe)],cwd=ROOT)
    ok=s.returncode==0 and u.returncode==1 and json.loads(safe.read_text())["status"]=="pass" and json.loads(unsafe.read_text())["summary"]["total"]>=1
    safe.unlink(missing_ok=True); unsafe.unlink(missing_ok=True)
    if not ok: print("package behavioral verification failed",file=sys.stderr); return 1
    print("Package verification passed."); return 0
if __name__=="__main__": raise SystemExit(main())
