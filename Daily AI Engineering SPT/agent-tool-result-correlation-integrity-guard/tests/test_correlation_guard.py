import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "correlation_guard.py"
spec = importlib.util.spec_from_file_location("correlation_guard", SCRIPT)
correlation_guard = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(correlation_guard)

POLICY = {
    "allow_partial_continuation": False,
    "quarantine_stale_generations": True,
    "reject_conflicting_duplicate_results": True,
    "ignore_identical_duplicate_results": True,
    "require_idempotency_for_side_effect_replay": True,
    "require_human_approval_for_unknown_side_effect_replay": True,
    "terminal_states": ["resolved", "failed", "cancelled"]
}


def inv(call_id="c1", generation=1, state="issued", **extra):
    data = {
        "session_id": "s1",
        "generation": generation,
        "agent_id": "a1",
        "tool_call_id": call_id,
        "state": state
    }
    data.update(extra)
    return data


def result(call_id="c1", generation=1, payload=None):
    return {
        "session_id": "s1",
        "generation": generation,
        "agent_id": "a1",
        "tool_call_id": call_id,
        "payload": {"ok": True} if payload is None else payload
    }


class CorrelationGuardTests(unittest.TestCase):
    def test_valid_result_allows_continuation(self):
        ledger = {"active_generation": 1, "invocations": [inv()], "results": [result()]}
        errors, report = correlation_guard.validate(ledger, POLICY)
        self.assertEqual([], errors)
        self.assertEqual(1, report["accepted_results"])

    def test_orphan_result_rejected(self):
        ledger = {"active_generation": 1, "invocations": [], "results": [result()]}
        errors, _ = correlation_guard.validate(ledger, POLICY)
        self.assertTrue(any("orphaned result" in e for e in errors))

    def test_identical_duplicate_ignored(self):
        ledger = {"active_generation": 1, "invocations": [inv()], "results": [result(), result()]}
        errors, report = correlation_guard.validate(ledger, POLICY)
        self.assertEqual([], errors)
        self.assertEqual(1, report["accepted_results"])

    def test_conflicting_duplicate_rejected(self):
        ledger = {"active_generation": 1, "invocations": [inv()], "results": [result(payload={"x": 1}), result(payload={"x": 2})]}
        errors, _ = correlation_guard.validate(ledger, POLICY)
        self.assertTrue(any("conflicting duplicate result" in e for e in errors))

    def test_stale_generation_quarantined(self):
        ledger = {"active_generation": 2, "invocations": [inv(generation=1)], "results": [result(generation=1)]}
        errors, report = correlation_guard.validate(ledger, POLICY)
        self.assertEqual([], errors)
        self.assertEqual(1, len(report["quarantined"]))

    def test_unresolved_active_call_blocks(self):
        ledger = {"active_generation": 1, "invocations": [inv()], "results": []}
        errors, report = correlation_guard.validate(ledger, POLICY)
        self.assertTrue(any("unresolved active tool calls" in e for e in errors))
        self.assertEqual(1, len(report["unresolved"]))

    def test_duplicate_invocation_identity_rejected(self):
        ledger = {"active_generation": 1, "invocations": [inv(), inv()], "results": []}
        errors, _ = correlation_guard.validate(ledger, POLICY)
        self.assertTrue(any("duplicate invocation identity" in e for e in errors))

    def test_side_effect_replay_requires_proof_or_approval(self):
        ledger = {
            "active_generation": 1,
            "invocations": [inv(state="resolved", side_effectful=True, replay_requested=True)],
            "results": []
        }
        errors, _ = correlation_guard.validate(ledger, POLICY)
        self.assertTrue(any("side-effect replay lacks" in e for e in errors))

    def test_side_effect_replay_with_idempotency_key_allowed(self):
        ledger = {
            "active_generation": 1,
            "invocations": [inv(state="resolved", side_effectful=True, replay_requested=True, idempotency_key="k1")],
            "results": []
        }
        errors, _ = correlation_guard.validate(ledger, POLICY)
        self.assertEqual([], errors)


if __name__ == "__main__":
    unittest.main()