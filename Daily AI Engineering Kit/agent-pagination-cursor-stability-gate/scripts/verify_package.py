#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REQUIRED=[
"README.md","config/policy.json","schemas/trace.schema.json","scripts/pagination_cursor_gate.py",
"scripts/verify_package.py","skills/investigate-cursor-instability.md","skills/plan-stable-pagination-fix.md",
"rules/cursor-stability-rules.md","subagents/pagination-explorer.md","subagents/fix-planner.md",
"subagents/verification-agent.md","workflows/cursor-stability.md","hooks/pre-change.md","hooks/post-change.md",
"examples/stable-trace.json","examples/unstable-trace.json","tests/test_pagination_cursor_gate.py"]
def run(cmd): return subprocess.run(cmd,cwd=ROOT,text=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
def main():
    missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
    if missing: print("missing files: "+", ".join(missing),file=sys.stderr); return 1
    for rel in ("config/policy.json","schemas/trace.schema.json","examples/stable-trace.json","examples/unstable-trace.json"):
        json.loads((ROOT/rel).read_text(encoding="utf-8"))
    t=run([sys.executable,"-m","unittest","tests/test_pagination_cursor_gate.py"])
    if t.returncode: print(t.stdout+t.stderr,file=sys.stderr); return 1
    with tempfile.TemporaryDirectory() as td:
        out=Path(td)/"report.json"
        bad=run([sys.executable,"scripts/pagination_cursor_gate.py","--trace","examples/unstable-trace.json","--policy","config/policy.json","--out",str(out)])
        if bad.returncode!=1: print("unstable example did not fail",file=sys.stderr); return 1
        if json.loads(out.read_text())["status"]!="fail": return 1
    print(f"verified {len(REQUIRED)} manifest files"); return 0
if __name__=="__main__": raise SystemExit(main())
