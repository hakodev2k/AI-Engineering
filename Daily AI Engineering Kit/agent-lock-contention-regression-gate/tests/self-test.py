#!/usr/bin/env python3
import json
import pathlib
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCAN = ROOT / "scripts" / "scan-lock-risk.py"
VALIDATE = ROOT / "scripts" / "validate-assessment.py"
SAMPLE = ROOT / "examples" / "sample-assessment.json"


def run(*args):
    return subprocess.run([sys.executable, *map(str, args)], text=True, capture_output=True)


def main():
    valid = run(VALIDATE, SAMPLE)
    if valid.returncode != 0:
        print(valid.stdout, valid.stderr)
        return 1

    with tempfile.TemporaryDirectory() as td:
        risky = pathlib.Path(td) / "Risky.cs"
        risky.write_text(
            "using System.Threading;\nclass X { object g=new(); void M(){ lock(g){ Thread.Sleep(10); } } }\n",
            encoding="utf-8",
        )
        scan = run(SCAN, risky, "--json")
        if scan.returncode != 1:
            print("expected scanner to return 1 for high risk", scan.stdout, scan.stderr)
            return 1
        payload = json.loads(scan.stdout)
        if not any(x.get("risk") == "high" for x in payload.get("findings", [])):
            print("expected high-risk finding")
            return 1

    bad = json.loads(SAMPLE.read_text(encoding="utf-8"))
    bad["verification"]["independent_verifier"] = False
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as f:
        json.dump(bad, f)
        bad_path = pathlib.Path(f.name)
    invalid = run(VALIDATE, bad_path)
    bad_path.unlink(missing_ok=True)
    if invalid.returncode == 0:
        print("expected invalid pass assessment to fail validation")
        return 1

    print("self-test passed")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
