#!/usr/bin/env python3
"""Validate desired plugin state against effective hook runtime state.

Snapshot schema (JSON):
{
  "plugins": {"plugin@market": "disabled"},
  "active_hooks": [{"id":"h1","plugin":"plugin@market","event":"PostToolUse"}],
  "visible_hook_ids": ["h1"],
  "post_transition_executions": [{"hook_id":"h1","plugin":"plugin@market"}],
  "stale_failure_counts": {"h1": 1},
  "live_unload_supported": true
}

Exit codes: 0 pass, 2 invalid input, 3 block, 4 restart required, 5 quarantine.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

PASS, INVALID, BLOCK, RESTART, QUARANTINE = 0, 2, 3, 4, 5


def load_object(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def require_str(value: object, name: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{name} must be a non-empty string")
    return value


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("snapshot", type=Path)
    parser.add_argument("--policy", required=True, type=Path)
    args = parser.parse_args()

    try:
        snap = load_object(args.snapshot)
        policy = load_object(args.policy)
        plugins = snap.get("plugins", {})
        hooks = snap.get("active_hooks", [])
        visible = snap.get("visible_hook_ids", [])
        executions = snap.get("post_transition_executions", [])
        failures = snap.get("stale_failure_counts", {})
        live_unload = snap.get("live_unload_supported", False)
        if not isinstance(plugins, dict) or not all(isinstance(k, str) and isinstance(v, str) for k, v in plugins.items()):
            raise ValueError("plugins must map plugin id to state")
        if not isinstance(hooks, list) or not isinstance(executions, list):
            raise ValueError("active_hooks and post_transition_executions must be arrays")
        if not isinstance(visible, list) or not all(isinstance(x, str) for x in visible):
            raise ValueError("visible_hook_ids must be strings")
        if not isinstance(failures, dict):
            raise ValueError("stale_failure_counts must be an object")
        if not isinstance(live_unload, bool):
            raise ValueError("live_unload_supported must be boolean")

        terminal = set(policy.get("terminal_plugin_states", ["disabled", "removed"]))
        active_ids: set[str] = set()
        stale: list[dict] = []
        for i, hook in enumerate(hooks):
            if not isinstance(hook, dict):
                raise ValueError(f"active_hooks[{i}] must be object")
            hid = require_str(hook.get("id"), f"active_hooks[{i}].id")
            owner = require_str(hook.get("plugin"), f"active_hooks[{i}].plugin")
            event = require_str(hook.get("event"), f"active_hooks[{i}].event")
            active_ids.add(hid)
            if plugins.get(owner) in terminal:
                stale.append({"id": hid, "plugin": owner, "event": event})

        hidden = sorted(active_ids - set(visible)) if policy.get("require_authoritative_inventory", True) else []
        stale_exec: list[dict] = []
        for i, event in enumerate(executions):
            if not isinstance(event, dict):
                raise ValueError(f"post_transition_executions[{i}] must be object")
            owner = require_str(event.get("plugin"), f"post_transition_executions[{i}].plugin")
            hid = require_str(event.get("hook_id"), f"post_transition_executions[{i}].hook_id")
            if plugins.get(owner) in terminal:
                stale_exec.append({"hook_id": hid, "plugin": owner})

        max_failures = int(policy.get("max_stale_failures", 2))
        quarantine = sorted(
            hid for hid, count in failures.items()
            if isinstance(hid, str) and isinstance(count, int) and count >= max_failures
        )

        findings: list[str] = []
        if stale:
            findings.append("terminal-state plugin owns active hook")
        if hidden:
            findings.append("effective hook missing from authoritative inventory")
        if stale_exec:
            findings.append("terminal-state plugin executed after transition")
        if quarantine:
            findings.append("stale hook failure budget exhausted")

        decision, code = "allow", PASS
        if quarantine:
            decision, code = "quarantine", QUARANTINE
        elif stale or stale_exec:
            if not live_unload and policy.get("allow_restart_required_state", True):
                decision, code = "restart_required", RESTART
            else:
                decision, code = "block", BLOCK
        elif hidden:
            decision, code = "block", BLOCK

        print(json.dumps({
            "decision": decision,
            "stale_hooks": stale,
            "hidden_active_hook_ids": hidden,
            "stale_executions": stale_exec,
            "quarantine_hook_ids": quarantine,
            "findings": findings,
        }, indent=2, sort_keys=True))
        return code
    except (ValueError, TypeError, OverflowError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID


if __name__ == "__main__":
    raise SystemExit(main())
