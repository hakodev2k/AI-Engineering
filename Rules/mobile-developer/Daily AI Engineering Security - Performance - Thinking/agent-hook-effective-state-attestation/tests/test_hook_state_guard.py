#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "hook_state_guard.py"
spec = importlib.util.spec_from_file_location("hook_state_guard", MODULE_PATH)
assert spec and spec.loader
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


def base_policy():
    return {
        "version": 1,
        "allow_unknown_noncritical_hooks": False,
        "hooks": [
            {
                "id": "gate",
                "event": "PreToolUse",
                "matcher": "Bash",
                "source": "enterprise",
                "command": "/opt/hooks/gate.sh",
                "state": "required",
                "critical": True,
            },
            {
                "id": "disabled-plugin",
                "event": "PostToolUse",
                "matcher": "Edit|Write",
                "source": "plugin:test",
                "command": "node /plugins/test/hook.mjs",
                "state": "forbidden",
                "critical": True,
            },
        ],
    }


def test_matching_required_hook_passes():
    runtime = {"hooks": [{"event": "PreToolUse", "matcher": "Bash", "source": "enterprise", "command": "/opt/hooks/gate.sh"}]}
    result = mod.reconcile(base_policy(), runtime)
    assert result["verified"] is True
    assert result["counts"]["matched"] == 1


def test_missing_critical_hook_blocks():
    result = mod.reconcile(base_policy(), {"hooks": []})
    assert result["verified"] is False
    assert result["counts"]["missing"] == 1


def test_forbidden_hook_active_blocks():
    runtime = {
        "hooks": [
            {"event": "PreToolUse", "matcher": "Bash", "source": "enterprise", "command": "/opt/hooks/gate.sh"},
            {"event": "PostToolUse", "matcher": "Edit|Write", "source": "plugin:test", "command": "node /plugins/test/hook.mjs"},
        ]
    }
    result = mod.reconcile(base_policy(), runtime)
    assert result["verified"] is False
    assert result["counts"]["forbidden_active"] == 1


def test_unknown_hook_blocks_by_default():
    runtime = {
        "hooks": [
            {"event": "PreToolUse", "matcher": "Bash", "source": "enterprise", "command": "/opt/hooks/gate.sh"},
            {"event": "PostToolUse", "matcher": "*", "source": "unknown", "command": "/tmp/extra.sh"},
        ]
    }
    result = mod.reconcile(base_policy(), runtime)
    assert result["verified"] is False
    assert result["counts"]["unknown"] == 1


def test_command_whitespace_is_normalized():
    runtime = {"hooks": [{"event": "PreToolUse", "matcher": "Bash", "source": "enterprise", "command": "  /opt/hooks/gate.sh   "}]}
    result = mod.reconcile(base_policy(), runtime)
    assert result["verified"] is True
