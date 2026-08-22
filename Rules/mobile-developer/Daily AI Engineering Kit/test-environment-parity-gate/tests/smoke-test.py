#!/usr/bin/env python3
import json, os, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PY = sys.executable


def run(args, expected):
    p = subprocess.run([PY] + [str(x) for x in args], cwd=ROOT, capture_output=True, text=True)
    if p.returncode != expected:
        raise AssertionError(f"command {args} exit={p.returncode} expected={expected}\nstdout={p.stdout}\nstderr={p.stderr}")


def write(path, obj):
    path.write_text(json.dumps(obj, indent=2), encoding="utf-8")


def main():
    policy = ROOT / "config/parity-policy.json"
    contract = json.loads((ROOT / "templates/environment-contract.example.json").read_text(encoding="utf-8"))
    snap = json.loads((ROOT / "examples/test-environment.snapshot.json").read_text(encoding="utf-8"))
    with tempfile.TemporaryDirectory() as td:
        td = Path(td); c = td/"contract.json"; s = td/"snapshot.json"; e = td/"eval.json"; g = td/"gate.json"; r = td/"review.json"
        write(c, contract); write(s, snap)
        run([ROOT/"scripts/evaluate-parity.py", "--contract", c, "--snapshot", s, "--policy", policy, "--output", e], 2)
        ev = json.loads(e.read_text())
        assert ev["status"] == "review-required"
        review = {"version":1,"reviewer_id":"reviewer","implementation_owner":"implementation-agent","contract_fingerprint":ev["contract_fingerprint"],"snapshot_fingerprint":ev["snapshot_fingerprint"],"verdict":"approved","reviewed_gap_ids":[x["id"] for x in ev["gaps"]],"evidence":["test://smoke"]}
        write(r, review)
        run([ROOT/"scripts/evaluate-parity-gate.py", "--evaluation", e, "--review", r, "--implementation-owner", "implementation-agent", "--tests-status", "passed", "--output", g], 0)
        assert json.loads(g.read_text())["status"] == "verified"
        broken = json.loads(json.dumps(snap)); del broken["dimensions"]["database"]; write(s, broken)
        run([ROOT/"scripts/evaluate-parity.py", "--contract", c, "--snapshot", s, "--policy", policy, "--output", e], 2)
        assert json.loads(e.read_text())["status"] == "blocked"
        run([ROOT/"scripts/evaluate-parity-gate.py", "--evaluation", e, "--review", r, "--implementation-owner", "implementation-agent", "--tests-status", "passed", "--output", g], 3)
        failed = json.loads(json.dumps(snap)); write(s, failed)
        run([ROOT/"scripts/evaluate-parity.py", "--contract", c, "--snapshot", s, "--policy", policy, "--output", e], 2)
        ev = json.loads(e.read_text()); stale = dict(review); stale["snapshot_fingerprint"] = "0"*64; write(r, stale)
        run([ROOT/"scripts/evaluate-parity-gate.py", "--evaluation", e, "--review", r, "--implementation-owner", "implementation-agent", "--tests-status", "passed", "--output", g], 3)
    print("smoke-test: PASS")
    return 0

if __name__ == "__main__": sys.exit(main())
