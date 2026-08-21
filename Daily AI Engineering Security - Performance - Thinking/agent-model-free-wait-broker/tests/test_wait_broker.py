import json, tempfile, unittest
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import wait_broker, wait_metrics

class WaitBrokerTests(unittest.TestCase):
    def setUp(self):
        self.policy = {
            "require_target_id": True,
            "reject_targets": ["noop", "none", "null", ""],
            "material_progress_delta": 0.05
        }

    def test_rejects_noop_target(self):
        with self.assertRaises(ValueError):
            wait_broker.validate_target("noop", self.policy, {"status":"running"})

    def test_accepts_real_target(self):
        wait_broker.validate_target("job-123", self.policy, {"status":"running"})

    def test_terminal_set(self):
        self.assertIn("completed", wait_broker.TERMINAL)
        self.assertIn("failed", wait_broker.TERMINAL)
        self.assertIn("cancelled", wait_broker.TERMINAL)

    def test_material_progress_threshold(self):
        self.assertTrue(wait_broker.material_progress({"progress":0.10}, {"progress":0.16}, 0.05))
        self.assertFalse(wait_broker.material_progress({"progress":0.10}, {"progress":0.12}, 0.05))

    def test_fingerprint_ignores_noise(self):
        a = {"status":"running", "progress":0.2, "debug":"a"}
        b = {"status":"running", "progress":0.2, "debug":"b"}
        self.assertEqual(wait_broker.fingerprint(a), wait_broker.fingerprint(b))

    def test_metrics_classifies_wait_only_turn(self):
        rows = [
            {"type":"model_turn","input_tokens":1000,"output_tokens":20,"tool_calls":[{"name":"wait"}]},
            {"type":"model_turn","input_tokens":800,"output_tokens":50,"tool_calls":[{"name":"exec"}],"action":"run tests"}
        ]
        r = wait_metrics.analyze(rows)
        self.assertEqual(r["wait_only_model_turns"], 1)
        self.assertEqual(r["wait_only_input_tokens"], 1000)

    def test_non_wait_decision_not_classified(self):
        rows = [{"type":"model_turn","input_tokens":100,"tool_calls":[{"name":"status"}],"decision":"cancel job"}]
        self.assertEqual(wait_metrics.analyze(rows)["wait_only_model_turns"], 0)

if __name__ == "__main__":
    unittest.main()
