#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "interrupt_liveness_guard.py"
spec = importlib.util.spec_from_file_location("interrupt_liveness_guard", SCRIPT)
assert spec and spec.loader
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

POLICY = {
    "ack_deadline_ms": 500,
    "cancel_effective_deadline_ms": 2000,
    "descendant_drain_deadline_ms": 5000,
    "maximum_post_cancel_side_effects": 0,
    "maximum_orphans_after_grace": 0,
    "require_monotonic_interrupt_epoch": True,
    "require_transcript_repair": True,
    "require_resume_reconciliation": True,
}


def event(t_ms, name, execution_id="run", epoch=1):
    return {"run_id": "r1", "execution_id": execution_id, "epoch": epoch, "event": name, "t_ms": t_ms}


class InterruptGuardTests(unittest.TestCase):
    def healthy(self):
        return [
            event(0, "descendant_started", "tool-1"),
            event(100, "interrupt_ingress"),
            event(150, "interrupt_ack"),
            event(300, "cancel_effective"),
            event(400, "descendant_terminal", "tool-1"),
            event(450, "transcript_repaired"),
            event(500, "resume_reconciled"),
            event(6000, "fixture_finished"),
        ]

    def test_healthy_fixture_is_effective(self):
        report = mod.analyze(self.healthy(), POLICY)
        self.assertEqual(report["decision"], "effective")
        self.assertEqual(report["metrics"]["post_cancel_side_effects"], 0)
        self.assertEqual(report["metrics"]["orphan_count_after_grace"], 0)

    def test_post_cancel_side_effect_blocks(self):
        rows = self.healthy()
        rows.append(event(350, "side_effect_admitted", "tool-2"))
        report = mod.analyze(rows, POLICY)
        self.assertEqual(report["decision"], "block")
        self.assertIn("post_cancel_side_effect_admitted", report["violations"])

    def test_late_ack_blocks(self):
        rows = self.healthy()
        for r in rows:
            if r["event"] == "interrupt_ack":
                r["t_ms"] = 900
        report = mod.analyze(rows, POLICY)
        self.assertIn("ack_deadline_exceeded", report["violations"])

    def test_orphan_after_grace_blocks(self):
        rows = [r for r in self.healthy() if r["event"] != "descendant_terminal"]
        report = mod.analyze(rows, POLICY)
        self.assertIn("descendant_not_drained", report["violations"])

    def test_missing_transcript_repair_blocks(self):
        rows = [r for r in self.healthy() if r["event"] != "transcript_repaired"]
        report = mod.analyze(rows, POLICY)
        self.assertIn("transcript_not_repaired", report["violations"])

    def test_missing_resume_reconciliation_blocks(self):
        rows = [r for r in self.healthy() if r["event"] != "resume_reconciled"]
        report = mod.analyze(rows, POLICY)
        self.assertIn("resume_not_reconciled", report["violations"])


if __name__ == "__main__":
    unittest.main()
