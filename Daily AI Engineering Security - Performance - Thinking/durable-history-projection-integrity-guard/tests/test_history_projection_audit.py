import unittest
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import history_projection_audit as audit


def rec(ordinal, kind, **extra):
    value = {"ordinal": ordinal, "type": kind}
    value.update(extra)
    return value


class HistoryProjectionAuditTests(unittest.TestCase):
    def setUp(self):
        self.durable = [
            rec(1, "user"),
            rec(2, "assistant"),
            rec(3, "token_count"),
            rec(4, "tool_call"),
            rec(5, "tool_result"),
            rec(6, "final", state="complete"),
            rec(7, "task_complete", state="complete"),
        ]

    def test_complete_projection_is_healthy(self):
        result = audit.evaluate(self.durable, list(self.durable), "idle")
        self.assertEqual(result["status"], "healthy")
        self.assertEqual(result["projection_coverage_ratio"], 1.0)

    def test_projection_stopping_before_tool_and_final_is_invalid(self):
        result = audit.evaluate(self.durable, self.durable[:3], "idle")
        self.assertEqual(result["status"], "invalid")
        self.assertTrue(result["missing_critical_ordinals"])
        self.assertIn("terminal-evidence-missing-from-projection", {x["code"] for x in result["findings"]})

    def test_only_noncritical_record_missing_is_degraded(self):
        projected = [r for r in self.durable if r["ordinal"] != 3]
        result = audit.evaluate(self.durable, projected, "idle")
        self.assertEqual(result["status"], "degraded")
        self.assertEqual(result["missing_critical_ordinals"], [])

    def test_duplicate_projection_ordinal_is_invalid(self):
        projected = list(self.durable) + [rec(7, "task_complete")]
        result = audit.evaluate(self.durable, projected, "idle")
        self.assertEqual(result["status"], "invalid")
        self.assertIn("projection-duplicate-ordinal", {x["code"] for x in result["findings"]})

    def test_completed_durable_with_interrupted_projected_state_is_invalid(self):
        projected = [dict(r) for r in self.durable]
        projected[-1]["state"] = "interrupted"
        result = audit.evaluate(self.durable, projected, "idle")
        self.assertEqual(result["status"], "invalid")
        self.assertIn("projected-terminal-state-contradiction", {x["code"] for x in result["findings"]})

    def test_event_type_mismatch_is_invalid(self):
        projected = [dict(r) for r in self.durable]
        projected[3]["type"] = "assistant"
        result = audit.evaluate(self.durable, projected, "idle")
        self.assertEqual(result["status"], "invalid")
        self.assertIn("event-type-mismatch", {x["code"] for x in result["findings"]})


if __name__ == "__main__":
    unittest.main()
