#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "analyze_usage.py"
POLICY = ROOT / "config" / "budgets.json"


class AnalyzerTests(unittest.TestCase):
    def run_case(self, records, policy=None):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td)
            data = td / "events.jsonl"
            data.write_text("\n".join(json.dumps(x) for x in records) + "\n", encoding="utf-8")
            policy_path = POLICY
            if policy is not None:
                policy_path = td / "policy.json"
                policy_path.write_text(json.dumps(policy), encoding="utf-8")
            proc = subprocess.run(
                [sys.executable, str(SCRIPT), str(data), "--policy", str(policy_path)],
                text=True,
                capture_output=True,
                check=False,
            )
            return proc, json.loads(proc.stdout) if proc.stdout.strip().startswith("{") else None

    def test_exact_usage_passes(self):
        policy = {
            "defaults": {
                "max_children_per_parent": 3,
                "max_total_tokens_per_parent_tree": 100000,
                "max_tokens_per_child": 50000,
                "max_unknown_token_ratio": 0.1,
                "max_child_token_share": 0.9
            },
            "roles": {},
            "enforcement": {"fail_on_budget_breach": True, "require_parent_id_for_children": True, "require_role_for_children": True}
        }
        records = [
            {"task_id": "t1", "agent_id": "root", "role": "root", "usage": {"input_tokens": 10000, "output_tokens": 1000}},
            {"task_id": "t1", "agent_id": "c1", "parent_id": "root", "role": "reviewer", "completed": True,
             "usage": {"input_tokens": 15000, "output_tokens": 1000, "cache_read_input_tokens": 5000}},
        ]
        proc, report = self.run_case(records, policy)
        self.assertEqual(proc.returncode, 0, proc.stderr)
        self.assertEqual(report["status"], "pass")
        self.assertEqual(report["summary"]["tasks"]["t1"]["child_count"], 1)

    def test_combined_tokens_are_unknown_not_guessed(self):
        policy = {
            "defaults": {
                "max_children_per_parent": 3,
                "max_total_tokens_per_parent_tree": 100000,
                "max_tokens_per_child": 90000,
                "max_unknown_token_ratio": 1.0,
                "max_child_token_share": 1.0
            },
            "roles": {},
            "enforcement": {"fail_on_budget_breach": True, "require_parent_id_for_children": True, "require_role_for_children": True}
        }
        records = [{"task_id": "t", "agent_id": "c", "parent_id": "p", "role": "research", "usage": {"subagent_tokens": 22000}}]
        proc, report = self.run_case(records, policy)
        self.assertEqual(proc.returncode, 0)
        event = report["normalized_events"][0]
        self.assertEqual(event["unknown_tokens"], 22000)
        self.assertEqual(event["input_tokens"], 0)
        self.assertEqual(event["output_tokens"], 0)

    def test_budget_breach_fails(self):
        records = [{"task_id": "t", "agent_id": "c", "parent_id": "p", "role": "guardian", "usage": {"input_tokens": 40000}}]
        proc, report = self.run_case(records)
        self.assertEqual(proc.returncode, 2)
        self.assertEqual(report["status"], "fail")
        self.assertTrue(any("child limit" in x for x in report["violations"]))

    def test_negative_tokens_invalid(self):
        records = [{"task_id": "t", "agent_id": "a", "role": "root", "usage": {"input_tokens": -1}}]
        proc, _ = self.run_case(records)
        self.assertEqual(proc.returncode, 3)


if __name__ == "__main__":
    unittest.main()
