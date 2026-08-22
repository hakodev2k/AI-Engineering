#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCANNER = ROOT / "scripts" / "scan-selectors.py"
VALIDATOR = ROOT / "scripts" / "validate-repair-report.py"
FIXTURE = ROOT / "tests"


def run(cmd):
    return subprocess.run(cmd, text=True, capture_output=True)


def main():
    with tempfile.TemporaryDirectory() as tmp:
        scan_out = Path(tmp) / "scan.json"
        result = run([sys.executable, str(SCANNER), str(FIXTURE), "--json-out", str(scan_out)])
        if result.returncode != 2:
            print(result.stdout, result.stderr)
            raise SystemExit("scanner should return 2 for high-risk fixture")
        data = json.loads(scan_out.read_text(encoding="utf-8"))
        if not any(item["kind"] == "nth-child" for item in data["findings"]):
            raise SystemExit("scanner did not detect nth-child fixture")

        report = {
            "test_file": "tests/example.spec.ts",
            "failure": "locator did not resolve",
            "old_locator": "form > div:nth-child(3) > button",
            "candidate_locator": "page.getByRole('button', { name: 'Save' })",
            "evidence": [{"source": "trace", "finding": "button accessible name is Save"}],
            "risk": "low",
            "verification": {"targeted_retest": "pass", "full_spec_retest": "pass"},
            "status": "verified"
        }
        report_path = Path(tmp) / "report.json"
        report_path.write_text(json.dumps(report), encoding="utf-8")
        valid = run([sys.executable, str(VALIDATOR), str(report_path)])
        if valid.returncode != 0:
            print(valid.stdout, valid.stderr)
            raise SystemExit("valid report was rejected")

    print("self-test passed")


if __name__ == "__main__":
    main()
