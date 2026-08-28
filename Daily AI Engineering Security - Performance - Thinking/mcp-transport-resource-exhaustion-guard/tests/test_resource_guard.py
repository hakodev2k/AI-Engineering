import unittest
from scripts.resource_guard import evaluate

LIMITS = {"max_buffer_bytes": 1024, "max_active_sessions": 10, "max_idle_session_seconds": 60}
BASE = {"role": "server", "internet_exposed": True, "buffered_bytes": 100, "active_sessions": 2, "oldest_idle_session_seconds": 10}

class ResourceGuardTests(unittest.TestCase):
    def test_normal_allows(self):
        self.assertTrue(evaluate(dict(BASE), LIMITS)["ok"])
    def test_buffer_exhaustion_blocks(self):
        o = dict(BASE); o["buffered_bytes"] = 1025
        self.assertIn("buffer_limit_exceeded", evaluate(o, LIMITS)["reasons"])
    def test_session_flood_blocks(self):
        o = dict(BASE); o["active_sessions"] = 11
        self.assertIn("session_limit_exceeded", evaluate(o, LIMITS)["reasons"])
    def test_idle_retention_blocks(self):
        o = dict(BASE); o["oldest_idle_session_seconds"] = 61
        self.assertIn("idle_session_limit_exceeded", evaluate(o, LIMITS)["reasons"])
    def test_missing_limit_blocks(self):
        bad = dict(LIMITS); del bad["max_buffer_bytes"]
        self.assertFalse(evaluate(dict(BASE), bad)["ok"])

if __name__ == "__main__":
    unittest.main()
