#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCAN = ROOT / "scripts" / "scan-pool-risk.py"
VALIDATE = ROOT / "scripts" / "validate-assessment.py"
EXAMPLE = ROOT / "examples" / "assessment.example.json"

def run(*args):
    return subprocess.run([sys.executable, *map(str, args)], capture_output=True, text=True)

def main():
    ok = True
    r = run(VALIDATE, EXAMPLE)
    if r.returncode != 0 or "assessment-valid" not in r.stdout:
        print("FAIL validator example", r.stdout, r.stderr)
        ok = False
    with tempfile.TemporaryDirectory() as d:
        p = Path(d) / "Worker.cs"
        p.write_text("class W { void X(){ var c = new SqlConnection(s); c.Open(); Task.WhenAll(a); } }", encoding="utf-8")
        r = run(SCAN, d, "--json")
        try:
            data = json.loads(r.stdout)
        except Exception:
            data = {}
        if r.returncode != 1 or not data.get("high_risk"):
            print("FAIL scanner risky fixture", r.stdout, r.stderr)
            ok = False
    if not ok:
        return 1
    print("self-test-pass")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
