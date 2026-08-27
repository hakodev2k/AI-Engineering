import unittest
from scripts.lifecycle_guard import evaluate

POLICY = {
    "max_attempts": 3,
    "base_backoff_ms": 250,
    "max_backoff_ms": 2000,
    "retry_http_statuses": [500, 502, 503, 504],
    "retry_error_codes": ["timeout", "connection_reset", "stale_process_handle"],
    "terminal_error_codes": ["unauthorized", "forbidden", "protocol_incompatible", "invalid_configuration"],
}

class LifecycleGuardTests(unittest.TestCase):
    def test_502_retries_with_bound(self):
        r = evaluate({"transport":"http","phase":"initialize_error","attempt":1,"http_status":502}, POLICY)
        self.assertEqual(r["action"], "retry")
        self.assertEqual(r["next_attempt"], 2)

    def test_retry_budget_exhausts(self):
        r = evaluate({"transport":"http","phase":"initialize_error","attempt":3,"http_status":502}, POLICY)
        self.assertEqual(r["action"], "stop")
        self.assertEqual(r["state"], "failed")

    def test_protocol_error_fails_fast(self):
        r = evaluate({"transport":"http","phase":"initialize_error","attempt":1,"error_code":"protocol_incompatible"}, POLICY)
        self.assertEqual(r["action"], "stop")

    def test_stdio_stale_handle_with_liveness_retries(self):
        r = evaluate({"transport":"stdio","phase":"tool_call_error","attempt":1,"error_code":"stale_process_handle","process_alive":True}, POLICY)
        self.assertEqual(r["action"], "retry")

    def test_confirmed_dead_process_stops(self):
        r = evaluate({"transport":"stdio","phase":"tool_call_error","attempt":1,"error_code":"process_exited","process_alive":False,"health_probe_ok":False}, POLICY)
        self.assertEqual(r["action"], "stop")

    def test_ready_is_success(self):
        r = evaluate({"transport":"stdio","phase":"ready","attempt":1}, POLICY)
        self.assertTrue(r["ok"])

if __name__ == "__main__":
    unittest.main()
