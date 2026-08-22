import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "outbox_inbox_gate.py"
spec = importlib.util.spec_from_file_location("outbox_inbox_gate", SCRIPT)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)


class DeliveryGateTests(unittest.TestCase):
    def policy(self):
        return {
            "outbox": {"max_attempts": 5},
            "inbox": {"dedupe_ttl_hours": 72},
            "verification": {"require_transactional_enqueue": True},
        }

    def valid_snapshot(self):
        return {
            "eventId": "evt-1",
            "idempotencyKey": "evt-1",
            "approvalRequired": False,
            "approvalPresent": False,
            "outbox": {
                "transactionalEnqueue": True,
                "stableEventId": True,
                "boundedRetries": True,
                "markDeliveredAfterAck": True,
                "crashRecoverable": True,
                "maxObservedAttempts": 2,
            },
            "inbox": {
                "atomicDedupe": True,
                "durableIdentity": True,
                "ackAfterCommit": True,
                "boundedRetries": True,
            },
            "effects": {
                "sideEffectCountAfterDuplicateDelivery": 1,
                "externalSideEffectsIdempotentOrReconciled": True,
            },
        }

    def test_passes_safe_delivery(self):
        result = module.validate(self.valid_snapshot(), self.policy())
        self.assertEqual("pass", result["status"])
        self.assertEqual(1, result["verification"]["sideEffectCount"])

    def test_blocks_non_atomic_outbox(self):
        snapshot = self.valid_snapshot()
        snapshot["outbox"]["transactionalEnqueue"] = False
        result = module.validate(snapshot, self.policy())
        self.assertEqual("block", result["status"])
        self.assertTrue(any("transactional enqueue" in e for e in result["errors"]))

    def test_blocks_duplicate_business_effect(self):
        snapshot = self.valid_snapshot()
        snapshot["effects"]["sideEffectCountAfterDuplicateDelivery"] = 2
        result = module.validate(snapshot, self.policy())
        self.assertEqual("block", result["status"])

    def test_requires_approval(self):
        snapshot = self.valid_snapshot()
        snapshot["approvalRequired"] = True
        result = module.validate(snapshot, self.policy())
        self.assertEqual("needs-approval", result["status"])

    def test_blocks_retry_budget_overrun(self):
        snapshot = self.valid_snapshot()
        snapshot["outbox"]["maxObservedAttempts"] = 6
        result = module.validate(snapshot, self.policy())
        self.assertEqual("block", result["status"])
        self.assertTrue(any("exceeds policy" in e for e in result["errors"]))

    def test_json_loader(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "input.json"
            path.write_text(json.dumps(self.valid_snapshot()), encoding="utf-8")
            loaded = module.load_structured(path)
            self.assertEqual("evt-1", loaded["eventId"])


if __name__ == "__main__":
    unittest.main()
