#!/usr/bin/env python3
import copy
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "continuity_guard.py"
spec = importlib.util.spec_from_file_location("continuity_guard", SCRIPT)
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)

POLICY = json.loads((ROOT / "config" / "continuity-policy.json").read_text(encoding="utf-8"))


def capsule():
    obj = {
        "task_id": "task-42",
        "generation": 7,
        "active_turn": {"id": "turn-99"},
        "active_goal": "Fix the checkout regression and verify tests",
        "constraints": ["Do not change public API"],
        "decisions": [{"id": "d1", "decision": "Keep API stable", "evidence_refs": ["e1"]}],
        "completed": [{"id": "c1", "summary": "Reproduced regression", "evidence_refs": ["e2"]}],
        "failed_approaches": [{"id": "f1", "approach": "Retry old parser", "reason": "fails fixture X", "evidence_refs": ["e3"]}],
        "open_items": [{"id": "o1", "summary": "Implement minimal fix"}],
        "blockers": [],
        "evidence_refs": [{"id": "e1", "ref": "tests/api-contract"}, {"id": "e2", "ref": "logs/repro"}, {"id": "e3", "ref": "tests/fixture-x"}]
    }
    obj["checksum"] = guard.checksum(obj)
    return obj


class ContinuityGuardTests(unittest.TestCase):
    def test_valid_capsule(self):
        self.assertEqual([], guard.validate_capsule(capsule(), POLICY, True))

    def test_goal_loss_is_detected(self):
        before = capsule()
        after = copy.deepcopy(before)
        after["active_goal"] = "Different goal"
        after["checksum"] = guard.checksum(after)
        mismatches = guard.compare(before, after, POLICY)
        self.assertTrue(any(m["field"] == "active_goal" for m in mismatches))

    def test_stale_turn_is_detected(self):
        before = capsule()
        after = copy.deepcopy(before)
        after["active_turn"]["id"] = "turn-12"
        after["checksum"] = guard.checksum(after)
        mismatches = guard.compare(before, after, POLICY)
        self.assertTrue(any(m["field"] == "active_turn.id" for m in mismatches))

    def test_failed_approach_loss_is_detected(self):
        before = capsule()
        after = copy.deepcopy(before)
        after["failed_approaches"] = []
        after["checksum"] = guard.checksum(after)
        mismatches = guard.compare(before, after, POLICY)
        self.assertTrue(any(m["field"] == "failed_approaches" for m in mismatches))

    def test_completed_work_loss_is_detected(self):
        before = capsule()
        after = copy.deepcopy(before)
        after["completed"] = []
        after["checksum"] = guard.checksum(after)
        mismatches = guard.compare(before, after, POLICY)
        self.assertTrue(any(m["field"] == "completed" for m in mismatches))

    def test_tampered_checksum_fails(self):
        obj = capsule()
        obj["constraints"].append("new constraint")
        errors = guard.validate_capsule(obj, POLICY, True)
        self.assertTrue(any("checksum mismatch" in e for e in errors))

    def test_decision_without_evidence_fails(self):
        obj = capsule()
        obj["decisions"][0]["evidence_refs"] = []
        obj["checksum"] = guard.checksum(obj)
        errors = guard.validate_capsule(obj, POLICY, True)
        self.assertTrue(any("requires evidence_refs" in e for e in errors))

    def test_completed_without_evidence_fails(self):
        obj = capsule()
        obj["completed"][0].pop("evidence_refs")
        obj["checksum"] = guard.checksum(obj)
        errors = guard.validate_capsule(obj, POLICY, True)
        self.assertTrue(any("requires artifact_refs or evidence_refs" in e for e in errors))


if __name__ == "__main__":
    unittest.main()
