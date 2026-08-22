#!/usr/bin/env python3
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "approval_watchdog.py"
POLICY = ROOT / "config" / "policy.json"


def run(events: str, now: str):
    with tempfile.TemporaryDirectory() as td:
        path = Path(td) / "events.jsonl"
        path.write_text(events, encoding="utf-8")
        proc = subprocess.run(
            [sys.executable, str(SCRIPT), str(path), "--policy", str(POLICY), "--now", now],
            text=True,
            capture_output=True,
            check=False,
        )
        report = json.loads(proc.stdout) if proc.stdout else {}
        return proc.returncode, report


def test_normal_approval_passes():
    events = "\n".join([
        '{"ts":"2026-08-21T09:00:00+07:00","type":"requested","request_id":"r1","agent_id":"main","approval_route":"desktop"}',
        '{"ts":"2026-08-21T09:00:02+07:00","type":"surfaced","request_id":"r1"}',
        '{"ts":"2026-08-21T09:00:05+07:00","type":"approved","request_id":"r1"}',
    ])
    code, report = run(events, "2026-08-21T09:00:06+07:00")
    assert code == 0
    assert report["status"] == "pass"


def test_hidden_prompt_fails_closed():
    events = '{"ts":"2026-08-21T09:00:00+07:00","type":"requested","request_id":"r2","agent_id":"main","approval_route":"desktop"}'
    code, report = run(events, "2026-08-21T09:06:00+07:00")
    assert code == 2
    violations = report["requests"][0]["violations"]
    assert "SURFACE_TIMEOUT" in violations
    assert "DECISION_TIMEOUT" in violations


def test_subagent_route_required():
    events = '{"ts":"2026-08-21T09:00:00+07:00","type":"requested","request_id":"r3","agent_id":"child","parent_agent_id":"main"}'
    code, report = run(events, "2026-08-21T09:00:01+07:00")
    assert code == 2
    assert "MISSING_PARENT_ROUTE" in report["requests"][0]["violations"]


def test_orphan_terminal_is_detected():
    events = '{"ts":"2026-08-21T09:00:00+07:00","type":"approved","request_id":"unknown"}'
    code, report = run(events, "2026-08-21T09:00:01+07:00")
    assert code == 2
    assert report["global_violations"][0]["code"] == "ORPHAN_EVENT"


def test_unsurfaced_approval_is_not_accepted():
    events = "\n".join([
        '{"ts":"2026-08-21T09:00:00+07:00","type":"requested","request_id":"r4","agent_id":"main","approval_route":"desktop"}',
        '{"ts":"2026-08-21T09:00:01+07:00","type":"approved","request_id":"r4"}',
    ])
    code, report = run(events, "2026-08-21T09:00:02+07:00")
    assert code == 2
    assert "UNSURFACED_APPROVAL" in report["requests"][0]["violations"]


if __name__ == "__main__":
    tests = [obj for name, obj in globals().copy().items() if name.startswith("test_") and callable(obj)]
    for test in tests:
        test()
        print(f"PASS {test.__name__}")
