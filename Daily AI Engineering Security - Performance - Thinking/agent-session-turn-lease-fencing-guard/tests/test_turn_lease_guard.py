import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "turn_lease_guard.py"
spec = importlib.util.spec_from_file_location("turn_lease_guard", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

POLICY = {
    "require_lease_for_mutation": True,
    "require_monotonic_epoch": True,
    "require_unique_operation_id": True,
    "allow_read_only_without_lease": True,
    "block_stale_epoch": True,
}


def enrich(events):
    return [dict(event, _line=i + 1) for i, event in enumerate(events)]


class TurnLeaseGuardTests(unittest.TestCase):
    def test_valid_single_writer(self):
        events = enrich([
            {"type": "lease_grant", "session_id": "s1", "actor_id": "a", "epoch": 1},
            {"type": "mutation", "session_id": "s1", "actor_id": "a", "epoch": 1, "operation_id": "op1"},
            {"type": "lease_revoke", "session_id": "s1", "epoch": 1},
            {"type": "lease_grant", "session_id": "s1", "actor_id": "b", "epoch": 2},
            {"type": "mutation", "session_id": "s1", "actor_id": "b", "epoch": 2, "operation_id": "op2"},
        ])
        self.assertEqual(mod.validate(POLICY, events)["status"], "ok")

    def test_overlapping_lease_blocked(self):
        events = enrich([
            {"type": "lease_grant", "session_id": "s1", "actor_id": "a", "epoch": 1},
            {"type": "lease_grant", "session_id": "s1", "actor_id": "b", "epoch": 2},
        ])
        codes = {v["code"] for v in mod.validate(POLICY, events)["violations"]}
        self.assertIn("overlapping_lease", codes)

    def test_stale_epoch_blocked(self):
        events = enrich([
            {"type": "lease_grant", "session_id": "s1", "actor_id": "a", "epoch": 3},
            {"type": "mutation", "session_id": "s1", "actor_id": "a", "epoch": 2, "operation_id": "op1"},
        ])
        codes = {v["code"] for v in mod.validate(POLICY, events)["violations"]}
        self.assertIn("stale_epoch", codes)

    def test_duplicate_operation_blocked(self):
        events = enrich([
            {"type": "lease_grant", "session_id": "s1", "actor_id": "a", "epoch": 1},
            {"type": "mutation", "session_id": "s1", "actor_id": "a", "epoch": 1, "operation_id": "same"},
            {"type": "mutation", "session_id": "s1", "actor_id": "a", "epoch": 1, "operation_id": "same"},
        ])
        codes = {v["code"] for v in mod.validate(POLICY, events)["violations"]}
        self.assertIn("duplicate_operation_id", codes)

    def test_mutation_without_lease_blocked(self):
        events = enrich([
            {"type": "mutation", "session_id": "s1", "actor_id": "a", "epoch": 1, "operation_id": "op1"}
        ])
        codes = {v["code"] for v in mod.validate(POLICY, events)["violations"]}
        self.assertIn("mutation_without_lease", codes)


if __name__ == "__main__":
    unittest.main()
