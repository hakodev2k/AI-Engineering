#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GATE = ROOT / "scripts" / "completion_gate.py"
POLICY = ROOT / "config" / "completion-policy.json"


def ledger(status="verified", evidence=None, terminal=True, mandatory=True):
    if evidence is None:
        evidence = [{
            "type": "test",
            "command": "pytest",
            "exit_code": 0,
            "scope": "focused",
            "result": "1 passed",
            "observed_at": "2026-08-19T12:00:00Z",
            "fresh": True,
            "paths": ["src/a.py"]
        }]
    return {
        "task_id": "fixture",
        "run_state": {"agent_loop_terminal": terminal, "last_stop_reason": "end_turn" if terminal else "tool_use", "process_exit_code": 0},
        "requirements": [{
            "id": "REQ-001", "text": "behavior works", "mandatory": mandatory,
            "status": status, "covered_paths": ["src/a.py"], "evidence": evidence, "uncertainty": []
        }],
        "changed_paths_after_evidence": [],
        "verdict": {"status": "incomplete", "blocking_reasons": [], "remediation_attempts": 0}
    }


class CompletionGateTests(unittest.TestCase):
    def run_gate(self, data):
        with tempfile.TemporaryDirectory() as td:
            p = Path(td) / "ledger.json"
            p.write_text(json.dumps(data), encoding="utf-8")
            cp = subprocess.run([sys.executable, str(GATE), "gate", "--ledger", str(p), "--policy", str(POLICY)], capture_output=True, text=True)
            return cp.returncode, json.loads(cp.stdout)

    def test_known_good_completes(self):
        code, out = self.run_gate(ledger())
        self.assertEqual(0, code)
        self.assertEqual("complete", out["status"])

    def test_implemented_is_not_verified(self):
        code, out = self.run_gate(ledger(status="implemented"))
        self.assertEqual(2, code)
        self.assertEqual("incomplete", out["status"])

    def test_claim_is_not_verification_evidence(self):
        ev = [{"type": "claim", "observed_at": "2026-08-19T12:00:00Z", "fresh": True, "result": "agent says tests pass"}]
        code, out = self.run_gate(ledger(evidence=ev))
        self.assertEqual(2, code)
        self.assertTrue(any("without fresh" in r for r in out["blocking_reasons"]))

    def test_failed_test_cannot_verify(self):
        ev = [{"type": "test", "command": "pytest", "exit_code": 1, "observed_at": "2026-08-19T12:00:00Z", "fresh": True, "paths": ["src/a.py"]}]
        code, _ = self.run_gate(ledger(evidence=ev))
        self.assertEqual(2, code)

    def test_stale_evidence_cannot_verify(self):
        ev = [{"type": "test", "command": "pytest", "exit_code": 0, "observed_at": "2026-08-19T12:00:00Z", "fresh": False, "paths": ["src/a.py"]}]
        code, _ = self.run_gate(ledger(evidence=ev))
        self.assertEqual(2, code)

    def test_exit_zero_mid_tool_is_not_complete(self):
        code, out = self.run_gate(ledger(terminal=False))
        self.assertEqual(2, code)
        self.assertTrue(any("nonterminal" in r for r in out["blocking_reasons"]))

    def test_duplicate_requirement_ids_are_invalid(self):
        data = ledger()
        data["requirements"].append(dict(data["requirements"][0]))
        code, out = self.run_gate(data)
        self.assertEqual(3, code)
        self.assertEqual("invalid", out["status"])

    def test_optional_unverified_does_not_block(self):
        data = ledger()
        data["requirements"].append({"id": "REQ-OPT", "text": "optional docs", "mandatory": False, "status": "implemented", "evidence": [], "covered_paths": []})
        code, out = self.run_gate(data)
        self.assertEqual(0, code)
        self.assertEqual("complete", out["status"])

    def test_freshness_command_invalidates_covered_path(self):
        with tempfile.TemporaryDirectory() as td:
            p = Path(td) / "ledger.json"
            c = Path(td) / "changed.txt"
            p.write_text(json.dumps(ledger()), encoding="utf-8")
            c.write_text("src/a.py\n", encoding="utf-8")
            cp = subprocess.run([sys.executable, str(GATE), "freshness", "--ledger", str(p), "--changed-paths-file", str(c)], capture_output=True, text=True)
            self.assertEqual(0, cp.returncode)
            updated = json.loads(p.read_text(encoding="utf-8"))
            self.assertFalse(updated["requirements"][0]["evidence"][0]["fresh"])
            self.assertEqual("implemented", updated["requirements"][0]["status"])


if __name__ == "__main__":
    unittest.main()
