#!/usr/bin/env python3
import hashlib
import importlib.util
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "transition_guard.py"
spec = importlib.util.spec_from_file_location("transition_guard", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


def base(plan_hash):
    return {
        "approval_status": "accepted",
        "approval_id": "approval-1",
        "plan_id": "plan-1",
        "plan_hash": plan_hash,
        "mode_before": "plan",
        "mode_after": "workspace-write",
        "transition_epoch": "7",
    }


def test_valid_transition():
    h = "a" * 64
    assert mod.validate(base(h), h, "workspace-write", "7") == []


def test_unapproved_fails():
    h = "b" * 64
    row = base(h)
    row["approval_status"] = "pending"
    assert mod.validate(row, h, "workspace-write", "7")


def test_stale_plan_fails():
    row = base("c" * 64)
    assert "plan_hash mismatch" in mod.validate(row, "d" * 64, "workspace-write", "7")


def test_wrong_mode_fails():
    h = "e" * 64
    assert mod.validate(base(h), h, "danger-full-access", "7")


def test_resume_epoch_mismatch_fails():
    h = "f" * 64
    assert "transition_epoch mismatch" in mod.validate(base(h), h, "workspace-write", "8")


if __name__ == "__main__":
    test_valid_transition()
    test_unapproved_fails()
    test_stale_plan_fails()
    test_wrong_mode_fails()
    test_resume_epoch_mismatch_fails()
    print("ok")
