import importlib.util
import json
import tempfile
import unittest
from argparse import Namespace
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "idempotency_guard.py"
spec = importlib.util.spec_from_file_location("guard", SCRIPT)
guard = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(guard)

POLICY = ROOT / "config" / "idempotency-policy.json"


class GuardTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.dir = Path(self.tmp.name)
        self.ledger = self.dir / "ledger.json"
        self.args = self.dir / "args.json"
        self.args.write_text(json.dumps({"title": "Deploy", "target": "prod-a"}), encoding="utf-8")

    def tearDown(self):
        self.tmp.cleanup()

    def reserve(self, classification="non_idempotent_write", key=None, downstream=False):
        return guard.reserve(Namespace(
            ledger=str(self.ledger), server="ops", tool="deploy",
            arguments_file=str(self.args), intent_id="intent-1",
            classification=classification, operation_key=key,
            downstream_idempotency=downstream
        ))

    def key(self):
        data = json.loads(self.ledger.read_text(encoding="utf-8"))
        return next(iter(data["operations"]))

    def transition(self, state, **kwargs):
        return guard.transition(Namespace(
            ledger=str(self.ledger), operation_key=self.key(), state=state,
            result_reference=kwargs.get("result_reference"),
            failure_reason=kwargs.get("failure_reason"),
            probe_status=kwargs.get("probe_status"),
            human_approval=kwargs.get("human_approval")
        ))

    def decision(self):
        return guard.retry_decision(Namespace(
            ledger=str(self.ledger), operation_key=self.key(), policy=str(POLICY)
        ))

    def test_same_logical_operation_not_reserved_twice(self):
        self.assertEqual(0, self.reserve())
        self.assertEqual(2, self.reserve())

    def test_same_key_changed_arguments_is_conflict(self):
        self.assertEqual(0, self.reserve())
        key = self.key()
        self.args.write_text(json.dumps({"title": "Deploy", "target": "prod-b"}), encoding="utf-8")
        self.assertEqual(3, self.reserve(key=key))

    def test_completed_duplicate_replays(self):
        self.reserve(); self.transition("in_progress")
        self.transition("completed", result_reference="deploy://42")
        self.assertEqual(0, self.reserve())

    def test_unknown_non_idempotent_is_blocked(self):
        self.reserve(); self.transition("in_progress"); self.transition("outcome_unknown")
        self.assertEqual(2, self.decision())

    def test_probe_absent_allows_retry(self):
        self.reserve(); self.transition("in_progress"); self.transition("outcome_unknown", probe_status="effect_absent")
        self.assertEqual(0, self.decision())

    def test_probe_present_reconciles_without_retry(self):
        self.reserve(); self.transition("in_progress"); self.transition("outcome_unknown", probe_status="effect_present", result_reference="deploy://42")
        self.assertEqual(0, self.decision())

    def test_read_only_unknown_can_retry(self):
        self.reserve(classification="read_only"); self.transition("in_progress"); self.transition("outcome_unknown")
        self.assertEqual(0, self.decision())

    def test_idempotent_write_requires_verified_contract(self):
        self.reserve(classification="idempotent_write", downstream=False); self.transition("in_progress"); self.transition("outcome_unknown")
        self.assertEqual(2, self.decision())

    def test_idempotent_write_with_contract_can_retry(self):
        self.reserve(classification="idempotent_write", downstream=True); self.transition("in_progress"); self.transition("outcome_unknown")
        self.assertEqual(0, self.decision())

    def test_known_failure_can_retry(self):
        self.reserve(); self.transition("in_progress"); self.transition("known_failed", failure_reason="validated before commit")
        self.assertEqual(0, self.decision())

    def test_retry_budget_blocks(self):
        self.reserve(classification="read_only")
        self.transition("in_progress"); self.transition("known_failed")
        self.transition("in_progress"); self.transition("known_failed")
        self.transition("in_progress"); self.transition("known_failed")
        self.assertEqual(2, self.decision())

    def test_human_override_is_explicit(self):
        self.reserve(); self.transition("in_progress"); self.transition("outcome_unknown", human_approval="approval://review-7")
        self.assertEqual(0, self.decision())


if __name__ == "__main__":
    unittest.main()
