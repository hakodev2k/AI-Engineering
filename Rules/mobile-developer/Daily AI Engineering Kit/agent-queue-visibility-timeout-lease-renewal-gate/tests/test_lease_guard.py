import importlib.util
from pathlib import Path
import unittest

MODULE = Path(__file__).resolve().parents[1] / "scripts" / "lease_guard.py"
spec = importlib.util.spec_from_file_location("lease_guard", MODULE)
lease_guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lease_guard)


class LeaseGuardTests(unittest.TestCase):
    def test_successful_processing_preserves_ownership(self):
        policy = lease_guard.Policy(visibility_timeout_seconds=5, renew_before_seconds=2, max_total_lease_seconds=20, max_renewals=3, heartbeat_interval_seconds=1)
        calls = {"n": 0}
        controller = lease_guard.LeaseController(policy, lambda _: True, lambda: True)

        def handler():
            calls["n"] += 1
            return calls["n"] >= 1

        result = controller.run(handler)
        self.assertEqual("pass", result["status"])
        self.assertEqual("completed", result["lease_state"])
        self.assertTrue(result["verification"]["ownership_preserved"])

    def test_lost_owner_blocks_processing(self):
        policy = lease_guard.Policy(visibility_timeout_seconds=5, renew_before_seconds=2, max_total_lease_seconds=20, max_renewals=3, heartbeat_interval_seconds=1)
        controller = lease_guard.LeaseController(policy, lambda _: True, lambda: False)
        result = controller.run(lambda: True)
        self.assertEqual("block", result["status"])
        self.assertEqual("lost", result["lease_state"])
        self.assertFalse(result["verification"]["handler_completed"])

    def test_renewal_rejection_blocks(self):
        policy = lease_guard.Policy(visibility_timeout_seconds=1, renew_before_seconds=2, max_total_lease_seconds=20, max_renewals=3, heartbeat_interval_seconds=1)
        controller = lease_guard.LeaseController(policy, lambda _: False, lambda: True)
        result = controller.run(lambda: True)
        self.assertEqual("block", result["status"])
        self.assertIn("renewal rejected", result["errors"][0])


if __name__ == "__main__":
    unittest.main()
