import importlib.util
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "resume_guard.py"
spec = importlib.util.spec_from_file_location("guard", MODULE_PATH)
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)


class ResumeGuardTests(unittest.TestCase):
    def setUp(self):
        self.policy = guard.validate_policy({
            "require_discriminated_envelope": True,
            "allow_scalar_only_when_single_pending": True,
            "require_all_pending_for_by_id": True,
            "reject_unknown_interrupt_ids": True,
            "reject_duplicate_pending_ids": True,
            "maximum_pending_interrupts": 128,
        })

    def test_scalar_allowed_for_single_pending(self):
        result = guard.evaluate(self.policy, ["i1"], {"kind": "scalar", "value": "yes"})
        self.assertTrue(result["allowed"])
        self.assertEqual(result["addressed_ids"], ["i1"])
        self.assertEqual(result["framework_resume"], "yes")

    def test_object_value_remains_scalar_when_explicit(self):
        value = {"action": "approve", "comment": "ship"}
        result = guard.evaluate(self.policy, ["i1"], {"kind": "scalar", "value": value})
        self.assertTrue(result["allowed"])
        self.assertEqual(result["framework_resume"], value)

    def test_scalar_blocked_for_multiple_pending(self):
        result = guard.evaluate(self.policy, ["left", "right"], {"kind": "scalar", "value": "ambiguous"})
        self.assertFalse(result["allowed"])
        self.assertEqual(result["reason"], "scalar_ambiguous_for_multiple_pending")

    def test_complete_id_map_allowed(self):
        result = guard.evaluate(self.policy, ["left", "right"], {
            "kind": "by_id", "values": {"left": True, "right": False}
        })
        self.assertTrue(result["allowed"])
        self.assertEqual(result["addressed_ids"], ["left", "right"])
        self.assertEqual(result["unresolved_ids"], [])

    def test_partial_id_map_blocked_by_strict_policy(self):
        result = guard.evaluate(self.policy, ["left", "right"], {
            "kind": "by_id", "values": {"left": True}
        })
        self.assertFalse(result["allowed"])
        self.assertEqual(result["reason"], "incomplete_interrupt_map")
        self.assertEqual(result["unresolved_ids"], ["right"])

    def test_unknown_id_blocked(self):
        result = guard.evaluate(self.policy, ["left"], {
            "kind": "by_id", "values": {"stale": True}
        })
        self.assertFalse(result["allowed"])
        self.assertEqual(result["reason"], "unknown_interrupt_id")

    def test_duplicate_pending_ids_are_input_error(self):
        with self.assertRaises(ValueError):
            guard.pending_ids([{"id": "same"}, {"id": "same"}], self.policy)

    def test_raw_dictionary_requires_envelope(self):
        result = guard.evaluate(self.policy, ["i1"], {"action": "approve"})
        self.assertFalse(result["allowed"])
        self.assertEqual(result["reason"], "discriminated_envelope_required")


if __name__ == "__main__":
    unittest.main()
