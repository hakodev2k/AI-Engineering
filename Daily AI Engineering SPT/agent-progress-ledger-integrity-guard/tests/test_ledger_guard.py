import copy
import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "ledger_guard.py"
spec = importlib.util.spec_from_file_location("ledger_guard", SCRIPT)
ledger_guard = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(ledger_guard)

POLICY = {
    "terminal_states": ["completed", "cancelled"],
    "allowed_transitions": {
        "pending": ["in_progress", "blocked", "cancelled"],
        "in_progress": ["blocked", "completed", "cancelled"],
        "blocked": ["in_progress", "cancelled"],
        "completed": [],
        "cancelled": []
    },
    "require_evidence_for_completed": True,
    "require_human_approval_for_mandatory_cancel": True,
    "require_baseline_hash_match": True,
    "high_risk_requires_independent_verifier": True
}


def make_ledger():
    tasks = [
        {"id": "TASK-001", "title": "Implement", "mandatory": True, "acceptance": ["feature works"]},
        {"id": "TASK-002", "title": "Verify", "mandatory": True, "acceptance": ["tests pass"]}
    ]
    return {
        "run_id": "run-test",
        "policy_version": "1.0",
        "baseline": {"sha256": ledger_guard.baseline_hash(tasks), "tasks": tasks},
        "events": [],
        "risk": "low"
    }


def event(seq, task, old, new, evidence=None, approval=None):
    e = {
        "seq": seq,
        "task_id": task,
        "from": old,
        "to": new,
        "actor": "impl-agent",
        "timestamp": "2026-08-20T10:00:00+07:00"
    }
    if evidence is not None:
        e["evidence"] = evidence
    if approval is not None:
        e["approval"] = approval
    return e


class LedgerGuardTests(unittest.TestCase):
    def test_valid_complete_run(self):
        ledger = make_ledger()
        ledger["events"] = [
            event(1, "TASK-001", "pending", "in_progress"),
            event(2, "TASK-001", "in_progress", "completed", ["test://feature"]),
            event(3, "TASK-002", "pending", "in_progress"),
            event(4, "TASK-002", "in_progress", "completed", ["ci://tests"])
        ]
        problems, states = ledger_guard.gate(ledger, POLICY)
        self.assertEqual([], problems)
        self.assertEqual("completed", states["TASK-001"])
        self.assertEqual("completed", states["TASK-002"])

    def test_pending_mandatory_blocks_stop(self):
        ledger = make_ledger()
        ledger["events"] = [
            event(1, "TASK-001", "pending", "in_progress"),
            event(2, "TASK-001", "in_progress", "completed", ["test://feature"])
        ]
        problems, _ = ledger_guard.gate(ledger, POLICY)
        self.assertTrue(any("TASK-002" in p and "pending" in p for p in problems))

    def test_completion_without_evidence_rejected(self):
        ledger = make_ledger()
        ledger["events"] = [
            event(1, "TASK-001", "pending", "in_progress"),
            event(2, "TASK-001", "in_progress", "completed", [])
        ]
        problems, _ = ledger_guard.validate(ledger, POLICY)
        self.assertTrue(any("requires non-empty evidence" in p for p in problems))

    def test_mandatory_cancel_requires_approval(self):
        ledger = make_ledger()
        ledger["events"] = [event(1, "TASK-001", "pending", "cancelled")]
        problems, _ = ledger_guard.validate(ledger, POLICY)
        self.assertTrue(any("requires approval" in p for p in problems))

    def test_approved_mandatory_cancel_allowed(self):
        ledger = make_ledger()
        ledger["events"] = [
            event(1, "TASK-001", "pending", "cancelled", approval="review://123"),
            event(2, "TASK-002", "pending", "cancelled", approval="review://123")
        ]
        problems, _ = ledger_guard.gate(ledger, POLICY)
        self.assertEqual([], problems)

    def test_baseline_tamper_detected(self):
        ledger = make_ledger()
        ledger["baseline"]["tasks"].pop()
        problems, _ = ledger_guard.validate(ledger, POLICY)
        self.assertTrue(any("baseline hash mismatch" in p for p in problems))

    def test_unknown_replacement_task_rejected(self):
        ledger = make_ledger()
        ledger["events"] = [event(1, "TASK-999", "pending", "in_progress")]
        problems, _ = ledger_guard.validate(ledger, POLICY)
        self.assertTrue(any("unknown task" in p for p in problems))

    def test_sequence_gap_rejected(self):
        ledger = make_ledger()
        ledger["events"] = [event(2, "TASK-001", "pending", "in_progress")]
        problems, _ = ledger_guard.validate(ledger, POLICY)
        self.assertTrue(any("sequence mismatch" in p for p in problems))

    def test_illegal_pending_to_completed_rejected(self):
        ledger = make_ledger()
        ledger["events"] = [event(1, "TASK-001", "pending", "completed", ["test://x"])]
        problems, _ = ledger_guard.validate(ledger, POLICY)
        self.assertTrue(any("illegal transition" in p for p in problems))

    def test_high_risk_requires_independent_verifier(self):
        ledger = make_ledger()
        ledger["risk"] = "high"
        ledger["events"] = [
            event(1, "TASK-001", "pending", "cancelled", approval="review://1"),
            event(2, "TASK-002", "pending", "cancelled", approval="review://1")
        ]
        problems, _ = ledger_guard.gate(ledger, POLICY)
        self.assertTrue(any("independent verifier" in p for p in problems))
        ledger["verifier"] = "review-agent-2"
        problems, _ = ledger_guard.gate(ledger, POLICY)
        self.assertEqual([], problems)

    def test_duplicate_baseline_id_rejected(self):
        ledger = make_ledger()
        ledger["baseline"]["tasks"].append(copy.deepcopy(ledger["baseline"]["tasks"][0]))
        ledger["baseline"]["sha256"] = ledger_guard.baseline_hash(ledger["baseline"]["tasks"])
        problems, _ = ledger_guard.validate(ledger, POLICY)
        self.assertTrue(any("duplicate baseline task id" in p for p in problems))


if __name__ == "__main__":
    unittest.main()
