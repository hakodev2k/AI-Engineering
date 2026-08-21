#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "reconcile_lifecycle.py"
POLICY = ROOT / "config" / "lifecycle-policy.json"

spec = importlib.util.spec_from_file_location("reconcile_lifecycle", SCRIPT)
assert spec and spec.loader
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)


class ReconcileTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.policy = module.load_policy(POLICY)
        cls.now = datetime(2026, 8, 21, 3, 0, 0, tzinfo=timezone.utc)

    def test_terminal_event_wins_over_stale_ui(self):
        item = {
            "child_id": "c1",
            "execution_id": "e1",
            "previous_execution_id": "e1",
            "previous_reconciled_state": "completed",
            "observed_at": "2026-08-21T02:00:00Z",
            "evidence": {
                "terminal_event": "completed",
                "authoritative_registry": "completed",
                "watched_status": "running",
                "ui_status": "working"
            }
        }
        result = module.reconcile(item, self.policy, self.now)
        self.assertEqual("completed", result["reconciled_state"])
        self.assertEqual("terminal_event", result["selected_source"])
        self.assertIn("terminal_and_active_evidence_disagree", result["conflicts"])
        self.assertTrue(result["blocking"])

    def test_same_execution_terminal_to_active_is_blocked(self):
        item = {
            "child_id": "c2",
            "execution_id": "e2",
            "previous_execution_id": "e2",
            "previous_reconciled_state": "completed",
            "observed_at": "2026-08-21T02:59:30Z",
            "evidence": {"authoritative_registry": "running"}
        }
        result = module.reconcile(item, self.policy, self.now)
        self.assertIn("terminal_to_active_resurrection_without_new_execution", result["conflicts"])
        self.assertTrue(result["blocking"])

    def test_new_execution_can_run(self):
        item = {
            "child_id": "c3",
            "execution_id": "e3-retry",
            "previous_execution_id": "e3-original",
            "previous_reconciled_state": "completed",
            "observed_at": "2026-08-21T02:59:30Z",
            "evidence": {"authoritative_registry": "running"}
        }
        result = module.reconcile(item, self.policy, self.now)
        self.assertFalse(result["blocking"])
        self.assertEqual("bounded_wait", result["decision"])

    def test_stale_active_state_is_blocked(self):
        item = {
            "child_id": "c4",
            "execution_id": "e4",
            "observed_at": "2026-08-21T02:00:00Z",
            "evidence": {"authoritative_registry": "running"}
        }
        result = module.reconcile(item, self.policy, self.now)
        self.assertIn("active_state_exceeds_staleness_budget", result["conflicts"])
        self.assertTrue(result["blocking"])

    def test_missing_evidence_requests_authoritative_query(self):
        result = module.reconcile({"child_id": "c5", "evidence": {}}, self.policy, self.now)
        self.assertEqual("unknown", result["reconciled_state"])
        self.assertEqual("query_authoritative_registry", result["decision"])


if __name__ == "__main__":
    unittest.main()
