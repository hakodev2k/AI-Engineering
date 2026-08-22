#!/usr/bin/env python3
import json, pathlib, subprocess, sys, tempfile
ROOT = pathlib.Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "action_ledger_check.py"

def check(records):
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as f:
        json.dump(records, f); name = f.name
    return subprocess.run([sys.executable, str(SCRIPT), name], capture_output=True, text=True)

def main():
    good = [
        {"signature":"test:a","uncertainty":"bug fixed?","expected_gain":3,"actual_gain":2,"evidence":"run1"},
        {"signature":"review:b","uncertainty":"release safe?","expected_gain":2,"actual_gain":2,"evidence":"review1","status_claim":"validated","status_evidence":"tests-pass"}
    ]
    r = check(good); assert r.returncode == 0, r.stdout + r.stderr
    bad = [{"signature":"probe:x","uncertainty":"same?","expected_gain":1,"actual_gain":0,"evidence":"e1"} for _ in range(3)]
    r = check(bad); assert r.returncode == 3, r.stdout + r.stderr
    data = json.loads(r.stdout); assert any(v["type"] == "third_similar_zero_gain_action" for v in data["violations"])
    print("PASS"); return 0

if __name__ == "__main__": raise SystemExit(main())
