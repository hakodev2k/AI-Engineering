#!/usr/bin/env python3
"""Run deterministic fixture suites for token_telemetry_guard.py."""
from __future__ import annotations
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GUARD = ROOT / "scripts" / "token_telemetry_guard.py"
POLICY = ROOT / "config" / "policy.json"
CASES = ROOT / "tests" / "cases.json"


def main() -> int:
    try:
        cases = json.loads(CASES.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"failed to load cases: {exc}", file=sys.stderr)
        return 2
    if not isinstance(cases, list) or not cases:
        print("cases.json must contain a non-empty array", file=sys.stderr)
        return 2
    failures = 0
    for case in cases:
        name = case.get("name", "unnamed")
        expect_safe = case.get("expect_safe")
        events = case.get("events")
        if not isinstance(expect_safe, bool) or not isinstance(events, list):
            print(f"FAIL: {name}: malformed fixture")
            failures += 1
            continue
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".jsonl", delete=False) as tmp:
            for event in events:
                tmp.write(json.dumps(event, ensure_ascii=False) + "\n")
            path = Path(tmp.name)
        try:
            run = subprocess.run(
                [sys.executable, str(GUARD), str(path), "--policy", str(POLICY), "--strict"],
                capture_output=True,
                text=True,
                check=False,
            )
            try:
                report = json.loads(run.stdout) if run.stdout.strip() else {}
            except json.JSONDecodeError:
                report = {}
            actual_safe = report.get("safe_for_automation")
            expected_exit = 0 if expect_safe else 3
            ok = actual_safe is expect_safe and run.returncode == expected_exit
            print(f"{'PASS' if ok else 'FAIL'}: {name}")
            if not ok:
                failures += 1
                print(f"  expected safe={expect_safe}, exit={expected_exit}")
                print(f"  actual safe={actual_safe}, exit={run.returncode}")
                print(f"  stdout={run.stdout.strip()} stderr={run.stderr.strip()}")
        finally:
            path.unlink(missing_ok=True)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
