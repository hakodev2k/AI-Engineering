#!/usr/bin/env python3
"""Contract tests for checkpoint utilities.

Run from the package root:
    python -m unittest tests/test_checkpoint_contract.py -v
"""

from __future__ import annotations

import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def load_module(name: str, relative: str):
    spec = importlib.util.spec_from_file_location(name, ROOT / relative)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot load {relative}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


builder = load_module("context_checkpoint", "scripts/context_checkpoint.py")
verifier = load_module("verify_checkpoint", "scripts/verify_checkpoint.py")


class CheckpointContractTests(unittest.TestCase):
    def setUp(self):
        self.policy = json.loads((ROOT / "config/checkpoint-policy.json").read_text(encoding="utf-8"))

    def valid_checkpoint(self):
        return {
            "schema_version": 1,
            "task_id": "task-1",
            "checkpoint_id": "cp-1",
            "created_at": "2026-08-19T09:00:00+00:00",
            "active_model": "test-model",
            "goal": "finish the implementation safely",
            "constraints": ["do not change public API"],
            "facts": ["tests existed before change"],
            "assumptions_to_verify": [],
            "decisions": [{"decision": "checkpoint before compact", "rationale": "preserve state"}],
            "changed_files": ["src/a.cs"],
            "tests_and_commands": [{"command": "dotnet test", "status": "passed"}],
            "artifacts": [],
            "blockers": [],
            "next_actions": ["review diff"],
            "verification_status": "verified",
            "failed_approaches": [],
            "source_checkpoint_id": None,
            "approx_tokens": 500,
        }

    def test_valid_checkpoint_passes(self):
        errors = verifier.verify_checkpoint(self.valid_checkpoint(), self.policy)
        self.assertEqual([], errors)

    def test_missing_goal_fails(self):
        cp = self.valid_checkpoint()
        cp["goal"] = ""
        errors = verifier.verify_checkpoint(cp, self.policy)
        self.assertTrue(any("goal" in e for e in errors))

    def test_verified_requires_success_evidence(self):
        cp = self.valid_checkpoint()
        cp["tests_and_commands"] = [{"command": "dotnet test", "status": "failed"}]
        errors = verifier.verify_checkpoint(cp, self.policy)
        self.assertTrue(any("successful verification evidence" in e for e in errors))

    def test_artifact_hash_mismatch_fails(self):
        cp = self.valid_checkpoint()
        with tempfile.TemporaryDirectory() as td:
            artifact = Path(td) / "result.txt"
            artifact.write_text("actual", encoding="utf-8")
            cp["artifacts"] = [{"path": str(artifact), "sha256": "0" * 64}]
            errors = verifier.verify_checkpoint(cp, self.policy)
        self.assertTrue(any("sha256 mismatch" in e for e in errors))

    def test_resume_cannot_drop_constraint(self):
        cp = self.valid_checkpoint()
        resume = {
            "task_id": "task-1",
            "goal": cp["goal"],
            "constraints": [],
            "changed_files": cp["changed_files"],
            "blockers": cp["blockers"],
        }
        # Empty resume constraints mean unknown/not supplied, so enforce an explicit wrong set instead.
        resume["constraints"] = ["some unrelated constraint"]
        errors = verifier.verify_resume(cp, resume)
        self.assertTrue(any("dropped" in e for e in errors))

    def test_token_estimate_is_positive(self):
        self.assertGreater(builder.approx_tokens({"a": "b"}), 0)


if __name__ == "__main__":
    unittest.main()
