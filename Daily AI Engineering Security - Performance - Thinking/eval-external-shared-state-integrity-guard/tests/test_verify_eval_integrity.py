#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "verify_eval_integrity.py"

def run(events):
    with tempfile.TemporaryDirectory() as d:
        d = Path(d)
        (d / "policy.json").write_text(json.dumps({"allowed_destinations":["https://task"]}), encoding="utf-8")
        (d / "events.jsonl").write_text("\n".join(json.dumps(x) for x in events), encoding="utf-8")
        return subprocess.run([sys.executable, str(SCRIPT), "--events", str(d/"events.jsonl"), "--policy", str(d/"policy.json"), "--run-id", "r1"], capture_output=True, text=True)

good = run([{"run_id":"r1","operation":"read","destination":"https://task","policy":"allowed"}])
assert good.returncode == 0, good.stdout + good.stderr
bad = run([{"run_id":"r1","operation":"read","destination":"https://task","policy":"allowed","owner_run_id":"r2"}])
assert bad.returncode == 2 and "cross-run-read" in bad.stdout, bad.stdout + bad.stderr
evaluator = run([{"run_id":"r1","operation":"read","destination":"https://task","policy":"evaluator"}])
assert evaluator.returncode == 2 and "evaluator-resource-access" in evaluator.stdout, evaluator.stdout + evaluator.stderr
print("ok")
