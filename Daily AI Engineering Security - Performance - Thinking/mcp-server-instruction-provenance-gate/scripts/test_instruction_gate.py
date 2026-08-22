#!/usr/bin/env python3
"""Run deterministic fixtures for instruction_gate.py."""
from __future__ import annotations
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GATE = ROOT / "scripts" / "instruction_gate.py"
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
    failed = 0
    for case in cases:
        name = case.get("name", "unnamed")
        expected_exit = case.get("expected_exit")
        expected_decision = case.get("expected_decision")
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".json", delete=False) as tmp:
            json.dump(case.get("input"), tmp)
            temp_path = Path(tmp.name)
        try:
            run = subprocess.run(
                [sys.executable, str(GATE), str(temp_path), "--policy", str(POLICY)],
                capture_output=True,
                text=True,
                check=False,
            )
            try:
                output = json.loads(run.stdout) if run.stdout.strip() else {}
            except json.JSONDecodeError:
                output = {}
            ok = run.returncode == expected_exit and output.get("decision") == expected_decision
            print(f"{'PASS' if ok else 'FAIL'}: {name}")
            if not ok:
                failed += 1
                print(f"  expected exit={expected_exit} decision={expected_decision}")
                print(f"  actual exit={run.returncode} stdout={run.stdout.strip()} stderr={run.stderr.strip()}")
        finally:
            temp_path.unlink(missing_ok=True)
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
