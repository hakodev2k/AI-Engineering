import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts/validate_rollout.py"
POLICY = ROOT / "config/policy.yaml"


def run(plan_text, today="2026-08-20"):
    with tempfile.TemporaryDirectory() as directory:
        plan = Path(directory) / "plan.yaml"
        plan.write_text(plan_text, encoding="utf-8")
        proc = subprocess.run(
            [sys.executable, str(SCRIPT), "--plan", str(plan), "--policy", str(POLICY), "--today", today],
            capture_output=True,
            text=True,
        )
        return proc.returncode, json.loads(proc.stdout)


BASE = """
flag_key: feature.test
owner: team-a
service: api
environment: staging
expires_on: 2026-10-01
kill_switch: true
risk_summary: test
rollback:
  trigger: metric breach
  action: disable the flag
observability:
  metrics:
    - name: error_rate
      abort_threshold: greater than 2%
    - name: latency
      abort_threshold: p95 greater than 500 ms
stages:
  - name: canary
    target_type: percentage
    percentage: 5
    duration_minutes: 10
    success_criteria: metrics healthy
  - name: expand
    target_type: percentage
    percentage: 25
    duration_minutes: 10
    success_criteria: metrics healthy
"""


class RolloutValidatorTests(unittest.TestCase):
    def test_safe_staging_plan_passes(self):
        code, result = run(BASE)
        self.assertEqual(code, 0)
        self.assertEqual(result["status"], "passed")
        self.assertFalse(result["executed"])

    def test_production_plan_requires_approval(self):
        code, result = run(BASE.replace("environment: staging", "environment: production"))
        self.assertEqual(code, 4)
        self.assertEqual(result["status"], "approval_required")
        self.assertTrue(any(x["code"] == "PRODUCTION_ROLLOUT_APPROVAL" for x in result["approvals"]))

    def test_full_rollout_requires_approval(self):
        plan = BASE + """
  - name: full
    target_type: percentage
    percentage: 100
    duration_minutes: 10
    success_criteria: metrics healthy
"""
        code, result = run(plan)
        self.assertEqual(code, 4)
        self.assertTrue(any(x["code"] == "FULL_ROLLOUT_APPROVAL" for x in result["approvals"]))

    def test_missing_kill_switch_blocks(self):
        code, result = run(BASE.replace("kill_switch: true", "kill_switch: false"))
        self.assertEqual(code, 2)
        self.assertTrue(any(x["code"] == "KILL_SWITCH_REQUIRED" for x in result["findings"]))

    def test_first_stage_too_large_blocks(self):
        code, result = run(BASE.replace("percentage: 5", "percentage: 50", 1))
        self.assertEqual(code, 2)
        self.assertTrue(any(x["code"] == "INITIAL_PERCENTAGE_TOO_HIGH" for x in result["findings"]))

    def test_missing_metric_blocks(self):
        plan = BASE.replace("    - name: latency\n      abort_threshold: p95 greater than 500 ms\n", "")
        code, result = run(plan)
        self.assertEqual(code, 2)
        self.assertTrue(any(x["code"] == "MISSING_REQUIRED_METRIC" for x in result["findings"]))

    def test_expiry_too_far_blocks(self):
        code, result = run(BASE.replace("expires_on: 2026-10-01", "expires_on: 2027-12-31"))
        self.assertEqual(code, 2)
        self.assertTrue(any(x["code"] == "EXPIRY_TOO_FAR" for x in result["findings"]))


if __name__ == "__main__":
    unittest.main()
