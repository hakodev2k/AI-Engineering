#!/usr/bin/env python3
"""Self-contained regression tests for the reference guard.

Run from the topic directory:
  python tests/test_guard.py
"""
from __future__ import annotations

import importlib.util
import json
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "context_injection_guard.py"
POLICY = ROOT / "config" / "policy.json"

spec = importlib.util.spec_from_file_location("guard", SCRIPT)
assert spec and spec.loader
mod = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = mod
spec.loader.exec_module(mod)


def event(turn: int, source: str, key: str, content: str, **extra):
    row = {"turn": turn, "source": source, "logical_key": key, "content": content}
    row.update(extra)
    return row


def run_case(rows):
    policy = mod.load_policy(POLICY)
    decisions, violation = mod.process(rows, policy)
    return decisions, violation


def assert_actions(rows, expected):
    decisions, violation = run_case(rows)
    actual = [d["action"] for d in decisions]
    assert actual == expected, f"expected {expected}, got {actual}: {json.dumps(decisions, indent=2)}"
    return decisions, violation


def main() -> int:
    d, v = assert_actions([
        event(1, "rules", "r:a", "same rule content long enough to suppress safely and exceed the threshold"),
        event(2, "rules", "r:a", "same rule content long enough to suppress safely and exceed the threshold"),
    ], ["include", "suppress"])
    assert not v

    d, v = assert_actions([
        event(1, "file_attachment", "f:a", "version one content long enough to be measured and suppressible if repeated"),
        event(2, "file_attachment", "f:a", "version two changed content long enough to be measured and suppressible if repeated"),
    ], ["include", "include"])
    assert not v

    d, v = assert_actions([
        event(1, "safety_policy", "p:s", "safety policy content must always remain visible even when repeated many times"),
        event(2, "safety_policy", "p:s", "safety policy content must always remain visible even when repeated many times"),
    ], ["include", "include"])
    assert not v and all(x["required"] for x in d)

    d, v = assert_actions([
        event(1, "tool_result", "tool:x", "tool result payload that is deliberately repeated and must remain model-visible"),
        event(2, "tool_result", "tool:x", "tool result payload that is deliberately repeated and must remain model-visible"),
    ], ["include", "include"])
    assert not v

    d, v = assert_actions([
        event(1, "new_runtime_source", "u:a", "unknown producer payload repeated for testing and safe fail-open behavior"),
        event(2, "new_runtime_source", "u:a", "unknown producer payload repeated for testing and safe fail-open behavior"),
    ], ["include", "include"])
    assert not v

    d, v = assert_actions([
        event(1, "hook", "h:a", "hook output with trailing whitespace and enough content to exceed suppression threshold   \nline two"),
        event(2, "hook", "h:a", "hook output with trailing whitespace and enough content to exceed suppression threshold\nline two"),
    ], ["include", "suppress"])
    assert not v

    d, v = assert_actions([
        event(1, "rules", "r:b", "long-lived rule content that remains unchanged for many turns and exceeds token threshold"),
        event(60, "rules", "r:b", "long-lived rule content that remains unchanged for many turns and exceeds token threshold"),
    ], ["include", "include"])
    assert not v

    policy = mod.load_policy(POLICY)
    huge = "x" * (policy.max_payload_bytes + 1)
    decisions, violation = mod.process([event(1, "hook", "h:huge", huge)], policy)
    assert decisions[0]["action"] == "reject" and not violation

    decisions, violation = mod.process([event(1, "safety_policy", "p:huge", huge)], policy)
    assert decisions[0]["action"] == "include" and not violation

    with tempfile.TemporaryDirectory() as td:
        p = Path(td) / "events.jsonl"
        p.write_text(json.dumps(event(1, "rules", "r:c", "a sufficiently long test rule payload for deterministic loading")) + "\n", encoding="utf-8")
        loaded = mod.read_events(p)
        assert len(loaded) == 1

    print("PASS: context injection guard regression suite")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
