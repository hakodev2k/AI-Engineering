#!/usr/bin/env python3
import json, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
"README.md","config/policy.json","schemas/tool-output-envelope.schema.json","schemas/scan-report.schema.json",
"scripts/injection_gate.py","scripts/verify_package.py","skills/classify-tool-output.md","skills/contain-suspicious-content.md",
"rules/tool-output-trust-boundary.md","subagents/content-classifier.md","subagents/security-reviewer.md","subagents/verification-agent.md",
"workflows/tool-output-containment.md","hooks/pre-tool-use.md","hooks/pre-privileged-action.md","examples/safe-output.json",
"examples/injected-output.json","tests/test_injection_gate.py"]

def main():
    missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
    if missing:
        print("missing files:\n"+"\n".join(missing), file=sys.stderr); return 1
    for p in ["config/policy.json","schemas/tool-output-envelope.schema.json","schemas/scan-report.schema.json","examples/safe-output.json","examples/injected-output.json"]:
        json.loads((ROOT/p).read_text(encoding="utf-8"))
    t=subprocess.run([sys.executable,"-m","unittest","discover","-s","tests","-p","test_*.py"], cwd=ROOT)
    if t.returncode: return t.returncode
    out=ROOT/".injection-report.json"
    g=subprocess.run([sys.executable,str(ROOT/"scripts/injection_gate.py"),"--input",str(ROOT/"examples/injected-output.json"),"--policy",str(ROOT/"config/policy.json"),"--output",str(out)], cwd=ROOT)
    if g.returncode != 1: return 1
    report=json.loads(out.read_text(encoding="utf-8")); out.unlink(missing_ok=True)
    if not report.get("requires_review"): return 1
    print("Package verification passed."); return 0
if __name__=="__main__": raise SystemExit(main())
