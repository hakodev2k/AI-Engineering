import hashlib
import importlib.util
import tempfile
import unittest
from pathlib import Path

MODULE = Path(__file__).resolve().parents[1] / "scripts" / "validate_handoff.py"
spec = importlib.util.spec_from_file_location("handoff", MODULE)
handoff = importlib.util.module_from_spec(spec)
spec.loader.exec_module(handoff)

POLICY = {
    "accepted_terminal_states": ["completed", "success"],
    "blocked_terminal_reasons": ["tool_deferred", "max_tokens", "cancelled", "stalled", "interrupted"],
    "require_verification_evidence": True,
    "require_sha256_for_artifact": True,
    "min_inline_deliverable_chars": 20,
    "allow_partial_checkpoint_on_failure": True,
}

class HandoffTests(unittest.TestCase):
    def test_valid_inline_is_accepted(self):
        env = {
            "task_id": "a1",
            "terminal_state": "completed",
            "terminal_reason": "stop",
            "unfinished_tool_calls": [],
            "deliverable": {"kind": "inline", "content": "Complete verified findings for parent."},
            "verification_evidence": ["tests passed"],
            "checkpoints": []
        }
        report = handoff.validate(env, POLICY, Path.cwd())
        self.assertEqual(report["status"], "accept")

    def test_completed_without_deliverable_is_rejected(self):
        env = {"task_id": "a2", "terminal_state": "completed", "verification_evidence": ["ran"]}
        report = handoff.validate(env, POLICY, Path.cwd())
        self.assertEqual(report["status"], "reject")
        self.assertTrue(any("deliverable" in r for r in report["blocking_reasons"]))

    def test_deferred_tool_blocks_success(self):
        env = {
            "task_id": "a3", "terminal_state": "success", "terminal_reason": "tool_deferred",
            "unfinished_tool_calls": ["bash:1"],
            "deliverable": {"kind": "inline", "content": "This text is long enough to otherwise pass."},
            "verification_evidence": ["none"]
        }
        report = handoff.validate(env, POLICY, Path.cwd())
        self.assertEqual(report["status"], "reject")

    def test_artifact_digest_verified(self):
        with tempfile.TemporaryDirectory() as td:
            base = Path(td)
            artifact = base / "report.md"
            artifact.write_text("durable report", encoding="utf-8")
            digest = hashlib.sha256(artifact.read_bytes()).hexdigest()
            env = {
                "task_id": "a4", "terminal_state": "completed", "terminal_reason": "stop",
                "unfinished_tool_calls": [],
                "deliverable": {"kind": "artifact", "path": "report.md", "sha256": digest},
                "verification_evidence": ["artifact reviewed"]
            }
            report = handoff.validate(env, POLICY, base)
            self.assertEqual(report["status"], "accept")
            self.assertTrue(report["digest_verified"])

if __name__ == "__main__":
    unittest.main()
