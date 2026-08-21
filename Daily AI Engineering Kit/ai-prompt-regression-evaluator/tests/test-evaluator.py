#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PY = sys.executable

def run(args, expect=(0,)):
    p = subprocess.run([PY, *args], cwd=ROOT, text=True, capture_output=True)
    if p.returncode not in expect:
        raise RuntimeError(f"command failed {args}\nstdout={p.stdout}\nstderr={p.stderr}")
    return p

def main():
    suite = "templates/eval-suite.json"
    policy = "config/eval-policy.json"
    run(["scripts/validate-suite.py", "--suite", suite, "--policy", policy])
    with tempfile.TemporaryDirectory() as d:
        d = Path(d)
        b = d / "baseline.json"; c = d / "candidate.json"; r = d / "report.json"
        run(["scripts/aggregate-results.py", "--suite", suite, "--runs", "examples/baseline-runs.jsonl", "--side", "baseline", "--output", str(b)])
        run(["scripts/aggregate-results.py", "--suite", suite, "--runs", "examples/candidate-runs.jsonl", "--side", "candidate", "--output", str(c)])
        # High-impact example requires independent review, so deterministic gate should be inconclusive (exit 10), not verified.
        run(["scripts/evaluate-regression.py", "--suite", suite, "--policy", policy, "--baseline", str(b), "--candidate", str(c), "--output", str(r)], expect=(10,))
        report = json.loads(r.read_text(encoding="utf-8"))
        assert report["status"] == "inconclusive", report
        assert report["requires_independent_review"] is True, report
        assert not any(x["status"] == "regressed" for x in report["cases"]), report
    print("smoke test passed")
    return 0

if __name__ == "__main__":
    sys.exit(main())
