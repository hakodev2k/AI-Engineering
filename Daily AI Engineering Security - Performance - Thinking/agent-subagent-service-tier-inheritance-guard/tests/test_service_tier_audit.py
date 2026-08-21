import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "service_tier_audit.py"
POLICY = ROOT / "config" / "policy.example.json"

spec = importlib.util.spec_from_file_location("service_tier_audit", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec.loader is not None
sys.modules[spec.name] = mod
spec.loader.exec_module(mod)


def write_jsonl(path: Path, records: list[dict]) -> None:
    path.write_text("".join(json.dumps(r) + "\n" for r in records), encoding="utf-8")


class ServiceTierAuditTests(unittest.TestCase):
    def setUp(self):
        self.policy = json.loads(POLICY.read_text(encoding="utf-8"))

    def audit_records(self, records: list[dict]):
        with tempfile.TemporaryDirectory() as td:
            p = Path(td) / "rollout.jsonl"
            write_jsonl(p, records)
            return mod.audit([p], self.policy)

    def test_valid_inheritance_and_repeated_counters(self):
        result = self.audit_records([
            {"thread_id": "root", "service_tier": "default", "usage": {"input_tokens": 100, "cached_input_tokens": 80, "output_tokens": 10, "total_tokens": 110}},
            {"thread_id": "root", "service_tier": "default", "usage": {"input_tokens": 100, "cached_input_tokens": 80, "output_tokens": 10, "total_tokens": 110}},
            {"thread_id": "child", "parent_thread_id": "root", "service_tier": "default", "usage": {"input_tokens": 50, "cached_input_tokens": 40, "output_tokens": 5, "total_tokens": 55}},
            {"thread_id": "child", "parent_thread_id": "root", "service_tier": "default", "usage": {"input_tokens": 90, "cached_input_tokens": 70, "output_tokens": 8, "total_tokens": 98}},
        ])
        self.assertTrue(result["pass"])
        rows = {r["thread_id"]: r for r in result["threads"]}
        self.assertEqual(rows["root"]["total_tokens"], 110)
        self.assertEqual(rows["child"]["total_tokens"], 98)
        self.assertEqual(rows["child"]["expected_tier"], "default")

    def test_unapproved_escalation_fails(self):
        result = self.audit_records([
            {"thread_id": "root", "service_tier": "default"},
            {"thread_id": "child", "parent_thread_id": "root", "service_tier": "priority"},
        ])
        self.assertFalse(result["pass"])
        types = [v["type"] for v in result["violations"]]
        self.assertIn("unapproved_tier_escalation", types)

    def test_approved_escalation_passes(self):
        result = self.audit_records([
            {"thread_id": "root", "service_tier": "default"},
            {
                "thread_id": "child",
                "parent_thread_id": "root",
                "service_tier": "priority",
                "tier_approval": {"approved": True, "actor": "operator", "reason": "time-critical verification"},
            },
        ])
        self.assertTrue(result["pass"])

    def test_unknown_child_tier_fails_closed(self):
        result = self.audit_records([
            {"thread_id": "root", "service_tier": "default"},
            {"thread_id": "child", "parent_thread_id": "root"},
        ])
        self.assertFalse(result["pass"])
        self.assertIn("unknown_child_tier", [v["type"] for v in result["violations"]])

    def test_counter_reset_starts_new_epoch(self):
        result = self.audit_records([
            {"thread_id": "root", "service_tier": "default", "usage": {"input_tokens": 100, "output_tokens": 10, "total_tokens": 110}},
            {"thread_id": "root", "service_tier": "default", "usage": {"input_tokens": 20, "output_tokens": 2, "total_tokens": 22}},
        ])
        rows = {r["thread_id"]: r for r in result["threads"]}
        self.assertEqual(rows["root"]["input_tokens"], 120)
        self.assertEqual(rows["root"]["output_tokens"], 12)
        self.assertEqual(rows["root"]["total_tokens"], 132)

    def test_depth_budget_violation(self):
        result = self.audit_records([
            {"thread_id": "r", "service_tier": "default"},
            {"thread_id": "c1", "parent_thread_id": "r", "service_tier": "default"},
            {"thread_id": "c2", "parent_thread_id": "c1", "service_tier": "default"},
            {"thread_id": "c3", "parent_thread_id": "c2", "service_tier": "default"},
        ])
        self.assertFalse(result["pass"])
        self.assertIn("lineage_depth", [v["type"] for v in result["violations"]])


if __name__ == "__main__":
    unittest.main()
