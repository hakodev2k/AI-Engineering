#!/usr/bin/env python3
"""Standard-library regression tests for feasibility_gate.py."""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "feasibility_gate.py"


def run_case(payload: dict) -> tuple[int, dict]:
    with tempfile.NamedTemporaryFile("w", suffix=".json", encoding="utf-8", delete=False) as fh:
        json.dump(payload, fh)
        path = fh.name
    proc = subprocess.run([sys.executable, str(SCRIPT), path], capture_output=True, text=True, check=False)
    Path(path).unlink(missing_ok=True)
    return proc.returncode, json.loads(proc.stdout)


class FeasibilityGateTests(unittest.TestCase):
    def test_blocking_conflict_stops_action(self) -> None:
        code, result = run_case({
            "goal": "Create a 1024x1024 canvas",
            "constraints": [{"id": "size", "required": True, "state": "unsatisfied", "evidence": "Only 1920x1920 is visible"}],
            "conflicts": [{"id": "size-mismatch", "severity": "blocking", "status": "open", "evidence": "Requested size unavailable"}],
            "previous_open_conflict_ids": [],
            "evidence_complete": True,
            "proposed_action": {"name": "click-1920-square", "consequential": True, "irreversible": False, "is_deviation": True, "deviation_allowed": False}
        })
        self.assertEqual(code, 2)
        self.assertEqual(result["decision"], "STOP")
        self.assertTrue(result["stop_reasons"])

    def test_incomplete_evidence_escalates_consequential_action(self) -> None:
        code, result = run_case({
            "goal": "Submit the configured form",
            "constraints": [{"id": "account", "required": True, "state": "unknown", "evidence": "Account label hidden"}],
            "conflicts": [],
            "previous_open_conflict_ids": [],
            "evidence_complete": False,
            "proposed_action": {"name": "submit", "consequential": True, "irreversible": True, "is_deviation": False, "deviation_allowed": False}
        })
        self.assertEqual(code, 3)
        self.assertEqual(result["decision"], "ESCALATE")

    def test_feasible_action_proceeds(self) -> None:
        code, result = run_case({
            "goal": "Select the 1024x1024 canvas",
            "constraints": [{"id": "size", "required": True, "state": "satisfied", "evidence": "Exact option visible"}],
            "conflicts": [],
            "previous_open_conflict_ids": [],
            "evidence_complete": True,
            "proposed_action": {"name": "click-1024-square", "consequential": False, "irreversible": False, "is_deviation": False, "deviation_allowed": False}
        })
        self.assertEqual(code, 0)
        self.assertEqual(result["decision"], "PROCEED")

    def test_dropped_conflict_state_stops(self) -> None:
        code, result = run_case({
            "goal": "Delete only the requested item",
            "constraints": [{"id": "target", "required": True, "state": "satisfied", "evidence": "Target visible"}],
            "conflicts": [],
            "previous_open_conflict_ids": ["ownership-uncertain"],
            "evidence_complete": True,
            "proposed_action": {"name": "delete", "consequential": True, "irreversible": True, "is_deviation": False, "deviation_allowed": False}
        })
        self.assertEqual(code, 2)
        codes = {r["code"] for r in result["stop_reasons"]}
        self.assertIn("CONFLICT_STATE_DROPPED", codes)


if __name__ == "__main__":
    unittest.main()
