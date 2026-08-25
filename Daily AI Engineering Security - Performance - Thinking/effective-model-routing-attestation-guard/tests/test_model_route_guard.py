import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import model_route_guard as guard


class GuardTests(unittest.TestCase):
    def test_match(self):
        intent = {"task_id": "t1", "model": "gpt-5.6-luna", "reasoning_effort": "low", "provider": "openai", "allow_inherit": False}
        observed = {"task_id": "t1", "model": "GPT-5.6-LUNA", "reasoning_effort": "low", "provider": "openai", "resolution": "explicit", "source": "turn_context"}
        self.assertEqual(guard.compare(intent, observed)["status"], "pass")

    def test_model_and_effort_drift(self):
        intent = {"task_id": "t1", "model": "luna", "reasoning_effort": "low"}
        observed = {"task_id": "t1", "model": "sol", "reasoning_effort": "high"}
        result = guard.compare(intent, observed)
        self.assertEqual(result["status"], "drift")
        self.assertEqual({d["field"] for d in result["drift"]}, {"model", "reasoning_effort"})

    def test_missing_runtime_evidence_fails(self):
        intent = {"task_id": "t1", "model": "luna", "reasoning_effort": "low", "service_tier": "flex"}
        observed = {"task_id": "t1", "model": "luna", "reasoning_effort": "low"}
        self.assertIn("service_tier", {d["field"] for d in guard.compare(intent, observed)["drift"]})

    def test_forbidden_inheritance(self):
        intent = {"task_id": "t1", "model": "luna", "reasoning_effort": "low", "allow_inherit": False}
        observed = {"task_id": "t1", "model": "luna", "reasoning_effort": "low", "resolution": "inherited"}
        self.assertEqual(guard.compare(intent, observed)["status"], "drift")


if __name__ == "__main__":
    unittest.main()
