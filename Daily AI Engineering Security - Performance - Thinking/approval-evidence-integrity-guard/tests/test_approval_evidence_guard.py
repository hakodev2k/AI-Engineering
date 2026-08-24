#!/usr/bin/env python3
import importlib.util
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "approval_evidence_guard.py"
spec = importlib.util.spec_from_file_location("approval_guard", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


def complete():
    return {
        "decision": "approve",
        "action": "apply_patch",
        "target": "src/app.py",
        "scope": {"paths": ["src/app.py"]},
        "rationale": "Writes repository source; verify the exact path.",
        "requires_human": True,
        "human_visible": True,
    }


def test_complete_passes():
    assert mod.validate(complete()) == []


def test_missing_required_fields_fail():
    row = complete()
    for key in ("action", "target", "scope", "rationale"):
        bad = dict(row)
        bad[key] = None
        assert mod.validate(bad), key


def test_hidden_human_gate_fails():
    row = complete()
    row["human_visible"] = False
    assert "human-gated approval was not rendered to a human" in mod.validate(row)


def test_deny_does_not_require_affirmative_evidence():
    assert mod.validate({"decision": "deny", "requires_human": True}) == []


if __name__ == "__main__":
    test_complete_passes()
    test_missing_required_fields_fail()
    test_hidden_human_gate_fails()
    test_deny_does_not_require_affirmative_evidence()
    print("ok")
