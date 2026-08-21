#!/usr/bin/env python3
"""Contract tests for tool_loop_guard.py using only stdlib."""
from __future__ import annotations

import importlib.util
import json
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("guard", ROOT / "scripts" / "tool_loop_guard.py")
assert SPEC and SPEC.loader
GUARD = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(GUARD)

POLICY = json.loads((ROOT / "config" / "policy.json").read_text(encoding="utf-8"))


def call(tool="grep", query="alpha", path="src", phase="explore", prior_status=""):
    return {"tool": tool, "arguments": {"query": query, "path": path}, "phase": phase, "prior_status": prior_status}


def event_for(c, output="same"):
    exact, family, normalized = GUARD.fingerprints(c, POLICY)
    return {
        "tool": c["tool"],
        "phase": c["phase"],
        "exact_fingerprint": exact,
        "family_fingerprint": family,
        "normalized_arguments": normalized,
        "status": "success",
        "output_digest": GUARD.digest(output)
    }


def state_with(c, n):
    return {"version": 1, "calls": [event_for(c) for _ in range(n)], "phase_counts": {c["phase"]: n}, "global_count": n, "recovery_cycles": 0}


def test_new_call_allowed():
    r = GUARD.decide(call(), GUARD.empty_state(), POLICY)
    assert r["decision"] == "allow", r


def test_whitespace_canonicalization():
    a = call(query="foo   bar")
    b = call(query="foo bar")
    assert GUARD.fingerprints(a, POLICY)[0] == GUARD.fingerprints(b, POLICY)[0]


def test_warning_after_repeats():
    c = call()
    r = GUARD.decide(c, state_with(c, 2), POLICY)
    assert r["decision"] in {"warn", "require-strategy-change", "block"}, r


def test_hard_block():
    c = call()
    r = GUARD.decide(c, state_with(c, 4), POLICY)
    assert r["decision"] == "block", r


def test_side_effect_ambiguous_requires_verification():
    c = {"tool": "send_email", "arguments": {"to": "x@example.test"}, "phase": "act", "prior_status": "timeout"}
    r = GUARD.decide(c, GUARD.empty_state(), POLICY)
    assert r["decision"] == "verify-before-retry", r


def test_phase_budget_blocks():
    c = call()
    s = GUARD.empty_state()
    s["phase_counts"] = {"explore": POLICY["defaults"]["phaseCallBudget"]}
    r = GUARD.decide(c, s, POLICY)
    assert r["decision"] == "block", r
    assert r["reason"] == "phase-call-budget-exhausted"


def test_atomic_record_roundtrip():
    with tempfile.TemporaryDirectory() as d:
        state_path = str(Path(d) / "state.json")
        c = call()
        Path(d, "call.json").write_text(json.dumps(c), encoding="utf-8")
        result = {"status": "success", "output": "hello", "elapsed_ms": 3}
        Path(d, "result.json").write_text(json.dumps(result), encoding="utf-8")
        # Exercise state writer directly to keep test deterministic.
        s = GUARD.empty_state()
        exact, family, normalized = GUARD.fingerprints(c, POLICY)
        s["calls"].append({"exact_fingerprint": exact, "family_fingerprint": family, "normalized_arguments": normalized})
        GUARD.atomic_write(state_path, s)
        loaded = GUARD.load_state(state_path)
        assert len(loaded["calls"]) == 1


def main():
    tests = [v for k, v in globals().items() if k.startswith("test_") and callable(v)]
    for t in tests:
        t()
        print(f"PASS {t.__name__}")
    print(f"PASS {len(tests)} tests")


if __name__ == "__main__":
    main()
