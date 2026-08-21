#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
POLICY=ROOT/"config/trace-policy.json"
VALIDATOR=ROOT/"scripts/validate-trace.py"
GATE=ROOT/"scripts/evaluate-trace-gate.py"
EXAMPLE=ROOT/"examples/verified-run.jsonl"

def run(cmd, expect=0):
    p=subprocess.run(cmd,text=True,capture_output=True)
    if p.returncode!=expect:
        raise AssertionError(f"expected {expect}, got {p.returncode}\nstdout={p.stdout}\nstderr={p.stderr}")
    return p

def review(path, reviewer="observability-reviewer", status="verified"):
    Path(path).write_text(json.dumps({"trace_id":"trace-demo-001","reviewer_id":reviewer,"status":status,"findings":[],"evidence_refs":["validation.json"]}),encoding="utf-8")

def main():
    with tempfile.TemporaryDirectory() as td:
        d=Path(td); clean=d/"clean.jsonl"; clean.write_text(EXAMPLE.read_text(encoding="utf-8"),encoding="utf-8")
        validation=d/"validation.json"; gate=d/"gate.json"; rev=d/"review.json"; review(rev)
        run([sys.executable,str(VALIDATOR),"--trace",str(clean),"--policy",str(POLICY),"--output",str(validation)])
        run([sys.executable,str(GATE),"--trace",str(clean),"--policy",str(POLICY),"--review",str(rev),"--output",str(gate)])
        assert json.loads(gate.read_text())["status"]=="verified"

        missing=d/"missing.jsonl"
        lines=[x for x in clean.read_text().splitlines() if '"event":"verification.completed"' not in x]
        missing.write_text("\n".join(lines)+"\n")
        run([sys.executable,str(VALIDATOR),"--trace",str(missing),"--policy",str(POLICY),"--output",str(d/"missing-validation.json")],expect=1)

        leaked=d/"leaked.jsonl"; rows=[json.loads(x) for x in clean.read_text().splitlines()]
        rows[0]["attributes"]["api_key"]="should-never-be-here"
        leaked.write_text("\n".join(json.dumps(x) for x in rows)+"\n")
        run([sys.executable,str(VALIDATOR),"--trace",str(leaked),"--policy",str(POLICY),"--output",str(d/"leaked-validation.json")],expect=1)

        high=d/"high.jsonl"; rows=[json.loads(x) for x in clean.read_text().splitlines()]
        for r in rows: r["risk"]="high"
        high.write_text("\n".join(json.dumps(x) for x in rows)+"\n"); selfrev=d/"selfreview.json"; review(selfrev,reviewer="implementation-agent")
        run([sys.executable,str(GATE),"--trace",str(high),"--policy",str(POLICY),"--review",str(selfrev),"--output",str(d/"high-gate.json")],expect=1)
        assert "reviewer-not-independent" in json.loads((d/"high-gate.json").read_text())["reasons"]
    print("smoke test passed")
    return 0
if __name__=="__main__": raise SystemExit(main())
