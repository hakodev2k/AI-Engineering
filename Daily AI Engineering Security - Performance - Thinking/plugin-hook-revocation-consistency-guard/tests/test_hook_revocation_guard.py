#!/usr/bin/env python3
"""Dependency-free regression tests for hook_revocation_guard.py."""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "hook_revocation_guard.py"
POLICY = ROOT / "config" / "policy.json"


def run(snapshot: dict) -> tuple[int, dict]:
    with tempfile.TemporaryDirectory() as td:
        path = Path(td) / "snapshot.json"
        path.write_text(json.dumps(snapshot), encoding="utf-8")
        p = subprocess.run(
            [sys.executable, str(SCRIPT), str(path), "--policy", str(POLICY)],
            text=True, capture_output=True, check=False,
        )
        payload = json.loads(p.stdout or p.stderr)
        return p.returncode, payload


def base() -> dict:
    return {
        "plugins": {"safe@market": "enabled", "off@market": "disabled"},
        "active_hooks": [{"id": "safe-1", "plugin": "safe@market", "event": "PostToolUse"}],
        "visible_hook_ids": ["safe-1"],
        "post_transition_executions": [],
        "stale_failure_counts": {},
        "live_unload_supported": True,
    }


def test_clean() -> None:
    code, out = run(base())
    assert code == 0 and out["decision"] == "allow"


def test_disabled_active_blocks() -> None:
    s = base()
    s["active_hooks"].append({"id": "ghost", "plugin": "off@market", "event": "PostToolUse"})
    s["visible_hook_ids"].append("ghost")
    code, out = run(s)
    assert code == 3 and out["decision"] == "block" and out["stale_hooks"]


def test_restart_required() -> None:
    s = base()
    s["active_hooks"].append({"id": "ghost", "plugin": "off@market", "event": "Stop"})
    s["visible_hook_ids"].append("ghost")
    s["live_unload_supported"] = False
    code, out = run(s)
    assert code == 4 and out["decision"] == "restart_required"


def test_hidden_hook_blocks() -> None:
    s = base()
    s["visible_hook_ids"] = []
    code, out = run(s)
    assert code == 3 and out["hidden_active_hook_ids"] == ["safe-1"]


def test_post_transition_execution_blocks() -> None:
    s = base()
    s["post_transition_executions"] = [{"hook_id": "ghost", "plugin": "off@market"}]
    code, out = run(s)
    assert code == 3 and out["stale_executions"]


def test_failure_budget_quarantines() -> None:
    s = base()
    s["stale_failure_counts"] = {"ghost": 2}
    code, out = run(s)
    assert code == 5 and out["decision"] == "quarantine"


if __name__ == "__main__":
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]
    for test in tests:
        test()
    print(f"ok: {len(tests)} tests")
