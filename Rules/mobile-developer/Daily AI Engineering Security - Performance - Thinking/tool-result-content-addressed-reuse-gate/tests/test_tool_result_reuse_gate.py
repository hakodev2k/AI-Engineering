#!/usr/bin/env python3
"""Synthetic regression tests for tool_result_reuse_gate.py."""
from __future__ import annotations
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("gate", ROOT / "scripts" / "tool_result_reuse_gate.py")
gate = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(gate)
POLICY = json.loads((ROOT / "config" / "policy.json").read_text(encoding="utf-8"))
PAYLOAD = "line\n" * 500


def base(output=PAYLOAD, epoch="e1", read_only=True, success=True, prior=None):
    return {
        "tool_name": "read_file",
        "normalized_arguments": {"path": "src/app.py"},
        "read_only": read_only,
        "success": success,
        "output": output,
        "context_epoch": epoch,
        "prior": prior or {},
    }


def full_record():
    result, code = gate.decide(base(), POLICY)
    assert code == gate.FULL
    return result["visibility_record"]


def test_first_result_is_full():
    result, code = gate.decide(base(), POLICY)
    assert code == gate.FULL
    assert result["model_payload"] == PAYLOAD


def test_identical_visible_result_uses_marker():
    prior = full_record()
    result, code = gate.decide(base(prior=prior), POLICY)
    assert code == gate.REUSE
    assert result["decision"] == "reuse_marker"
    assert result["saved_bytes"] > 0
    assert result["fresh_execution_preserved"] is True


def test_changed_result_is_full():
    prior = full_record()
    result, code = gate.decide(base(output=PAYLOAD + "changed", prior=prior), POLICY)
    assert code == gate.FULL


def test_context_epoch_change_forces_reinjection():
    prior = full_record()
    result, code = gate.decide(base(epoch="e2", prior=prior), POLICY)
    assert code == gate.FULL
    assert "context epoch changed" in result["reasons"]


def test_invisible_prior_forces_full():
    prior = full_record(); prior["full_payload_visible"] = False
    result, code = gate.decide(base(prior=prior), POLICY)
    assert code == gate.FULL


def test_error_never_elided():
    prior = full_record()
    result, code = gate.decide(base(success=False, prior=prior), POLICY)
    assert code == gate.FULL
    assert "result is error/unsuccessful" in result["reasons"]


def test_non_read_only_never_elided():
    prior = full_record()
    result, code = gate.decide(base(read_only=False, prior=prior), POLICY)
    assert code == gate.FULL
    assert "tool is not explicitly read-only" in result["reasons"]


def test_small_payload_not_elided():
    small = "tiny"
    first, _ = gate.decide(base(output=small), POLICY)
    prior = first["visibility_record"]
    result, code = gate.decide(base(output=small, prior=prior), POLICY)
    assert code == gate.FULL
    assert "payload below minimum size" in result["reasons"]
