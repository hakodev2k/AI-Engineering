import unittest
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from oauth_recovery_guard import analyze

POLICY = {"max_transport_retries": 2, "max_provider_recreations": 1, "lock_error_markers": ["current task is not holding this lock"], "poison_timeout_threshold": 3, "circuit_cooldown_seconds": 300}

class RecoveryTests(unittest.TestCase):
    def test_lock_error_requests_provider_recreation(self):
        r = analyze([{"server": "linear", "event": "lock_error", "error": "current task is not holding this lock"}], POLICY)
        self.assertEqual(r["timeline"][-1]["action"], "recreate_provider")

    def test_transport_failure_retries_before_provider_recreation(self):
        events = [{"server": "n", "event": "connect_failure"}, {"server": "n", "event": "connect_failure"}, {"server": "n", "event": "connect_failure"}]
        r = analyze(events, POLICY)
        self.assertEqual([x["action"] for x in r["timeline"]], ["retry_transport", "retry_transport", "recreate_provider"])

    def test_three_timeouts_classified_as_poison_signal(self):
        events = [{"server": "n", "event": "timeout"} for _ in range(3)]
        r = analyze(events, POLICY)
        self.assertEqual(r["timeline"][-1]["action"], "recreate_provider")

    def test_recreated_provider_increments_generation(self):
        events = [{"server": "n", "event": "lock_error"}, {"server": "n", "event": "provider_recreated"}, {"server": "n", "event": "success"}]
        r = analyze(events, POLICY)
        self.assertEqual(r["servers"]["n"]["provider_generation"], 1)
        self.assertEqual(r["servers"]["n"]["last_action"], "healthy")

    def test_repeated_poison_after_recreation_opens_circuit(self):
        events = [{"server": "n", "event": "lock_error"}, {"server": "n", "event": "provider_recreated"}, {"server": "n", "event": "lock_error"}]
        r = analyze(events, POLICY)
        self.assertTrue(r["servers"]["n"]["circuit_open"])
        self.assertEqual(r["timeline"][-1]["action"], "open_circuit")

    def test_success_resets_transport_failures(self):
        events = [{"server": "n", "event": "connect_failure"}, {"server": "n", "event": "success"}, {"server": "n", "event": "connect_failure"}]
        r = analyze(events, POLICY)
        self.assertEqual(r["servers"]["n"]["transport_retries"], 1)

    def test_servers_are_isolated(self):
        events = [{"server": "a", "event": "lock_error"}, {"server": "a", "event": "provider_recreated"}, {"server": "a", "event": "lock_error"}, {"server": "b", "event": "success"}]
        r = analyze(events, POLICY)
        self.assertTrue(r["servers"]["a"]["circuit_open"])
        self.assertFalse(r["servers"]["b"]["circuit_open"])

    def test_latency_metric(self):
        r = analyze([{"server": "n", "event": "connect_failure", "latency_ms": 100}, {"server": "n", "event": "success", "latency_ms": 20}], POLICY)
        self.assertEqual(r["servers"]["n"]["mean_latency_ms"], 60.0)

if __name__ == "__main__": unittest.main()
