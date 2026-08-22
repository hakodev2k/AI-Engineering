#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCANNER = ROOT / "scripts" / "scan-cancellation-risk.py"
VALIDATOR = ROOT / "scripts" / "validate-assessment.py"
EXAMPLE = ROOT / "examples" / "assessment.example.json"

def run(cmd):
    return subprocess.run(cmd, text=True, capture_output=True)

def main():
    if not SCANNER.is_file() or not VALIDATOR.is_file() or not EXAMPLE.is_file():
        print("missing required package file")
        return 2

    valid = run([sys.executable, str(VALIDATOR), str(EXAMPLE)])
    if valid.returncode != 0:
        print(valid.stdout, valid.stderr)
        return 3

    with tempfile.TemporaryDirectory() as temp:
        root = Path(temp)
        risky = root / "Worker.cs"
        risky.write_text(
            "public async Task RunAsync() { await Task.Delay(1000); var x = DoAsync().Result; }\n",
            encoding="utf-8"
        )
        scan = run([sys.executable, str(SCANNER), str(root), "--json"])
        if scan.returncode not in (0, 1):
            print(scan.stdout, scan.stderr)
            return 4
        payload = json.loads(scan.stdout)
        kinds = {f["kind"] for f in payload["findings"]}
        if "delay-without-token" not in kinds or "blocking-wait" not in kinds:
            print("scanner failed to detect expected fixtures")
            return 5

    print("self-test passed")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
