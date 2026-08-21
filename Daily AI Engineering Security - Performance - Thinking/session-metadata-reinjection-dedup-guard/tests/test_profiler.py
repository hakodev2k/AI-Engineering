#!/usr/bin/env python3
"""Regression tests for session_bloat_profiler.py."""
from __future__ import annotations
import json
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
PROFILER = HERE / "scripts" / "session_bloat_profiler.py"
POLICY = HERE / "config" / "budget.json"


def run_case(records: list[dict]) -> tuple[int, dict]:
    with tempfile.TemporaryDirectory() as td:
        session = Path(td) / "session.jsonl"
        session.write_text("".join(json.dumps(r) + "\n" for r in records), encoding="utf-8")
        p = subprocess.run(
            [sys.executable, str(PROFILER), str(session), "--policy", str(POLICY)],
            text=True, capture_output=True, check=False
        )
        if not p.stdout.strip():
            raise AssertionError(f"profiler produced no JSON: {p.stderr}")
        return p.returncode, json.loads(p.stdout)


def main() -> int:
    bloated = [
        {"type": "user", "content": "keep this", "timestamp": 1},
        {"type": "user", "content": "keep this", "timestamp": 2},
        {"type": "hook_success", "content": "same transient payload", "timestamp": 1},
        {"type": "hook_success", "content": "same transient payload", "timestamp": 2},
        {"type": "hook_success", "content": "same transient payload", "timestamp": 3},
        {"type": "hook_success", "content": "same transient payload", "timestamp": 4},
        {"type": "hook_success", "content": "same transient payload", "timestamp": 5},
    ]
    code, report = run_case(bloated)
    assert code == 3, (code, report)
    assert report["candidate_duplicate_bytes"] > 0, report
    assert report["duplicate_block"] is True, report
    protected_groups = [g for g in report["duplicate_groups"] if g["type"] == "user"]
    assert protected_groups and protected_groups[0]["candidate_redundant_bytes"] == 0, report

    healthy = [
        {"type": "user", "content": "question"},
        {"type": "assistant", "content": "answer"},
        {"type": "hook_success", "content": "unique hook result"},
    ]
    code, report = run_case(healthy)
    assert code == 0, (code, report)
    assert report["candidate_duplicate_bytes"] == 0, report
    assert report["decision"] == "pass", report
    print("all session profiler tests passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
