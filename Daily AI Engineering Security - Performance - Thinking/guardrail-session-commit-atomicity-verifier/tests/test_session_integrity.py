#!/usr/bin/env python3
import importlib.util
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("session_integrity", ROOT / "scripts" / "session_integrity.py")
MOD = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(MOD)

POLICY = {
    "require_terminal_reason": True,
    "allow_orphan_calls": False,
    "allow_orphan_outputs": False,
    "require_redaction_marker_for_blocked_terminal_tool_output": True,
    "blocked_output_marker": "Output withheld by an output guardrail.",
    "require_side_effect_commit_evidence": True,
    "require_streaming_parity_when_comparison_supplied": True,
}


class SessionIntegrityTests(unittest.TestCase):
    def test_valid_guardrail_redacted_pair(self):
        session = {
            "terminal_reason": "guardrail_tripwire",
            "guardrail_status": "tripwire",
            "items": [
                {"type":"function_call","call_id":"c1","executed":True,"side_effecting":True,"terminal_output":True},
                {"type":"function_call_output","call_id":"c1","content":"Output withheld by an output guardrail.","commit_evidence":True},
            ],
        }
        report, code = MOD.analyze(session, POLICY)
        self.assertEqual(code, 0)
        self.assertEqual(report["verdict"], "valid")

    def test_orphan_call_is_invalid(self):
        session = {
            "terminal_reason":"guardrail_tripwire",
            "guardrail_status":"tripwire",
            "items":[{"type":"function_call","call_id":"c1","executed":False,"side_effecting":False}],
        }
        report, code = MOD.analyze(session, POLICY)
        self.assertEqual(code, 3)
        self.assertTrue(any("orphan" in x for x in report["violations"]))

    def test_executed_side_effect_without_output_requires_manual_review(self):
        session = {
            "terminal_reason":"failure",
            "guardrail_status":"none",
            "items":[{"type":"function_call","call_id":"c1","executed":True,"side_effecting":True}],
        }
        report, code = MOD.analyze(session, POLICY)
        self.assertEqual(code, 4)
        self.assertEqual(report["verdict"], "manual_review")
        self.assertFalse(report["automatic_side_effect_replay_performed"])

    def test_mode_parity_mismatch_is_invalid(self):
        a = {"terminal_reason":"success","guardrail_status":"allow","items":[{"type":"assistant","content":"ok"}]}
        b = {"terminal_reason":"success","guardrail_status":"allow","items":[{"type":"assistant","content":"different"}]}
        report, code = MOD.analyze(a, POLICY, b)
        self.assertEqual(code, 3)
        self.assertFalse(report["comparison_parity"])


if __name__ == "__main__":
    unittest.main()
