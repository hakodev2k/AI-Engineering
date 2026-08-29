import importlib.util
import pathlib
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "resume_correlation_guard.py"
spec = importlib.util.spec_from_file_location("guard", SCRIPT)
guard = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(guard)


class ResumeCorrelationGuardTests(unittest.TestCase):
    def test_scalar_mode_rejected_for_multiple_pending(self):
        report = guard.validate(["i1", "i2"], {"mode": "single", "value": "yes"})
        self.assertFalse(report["ok"])
        self.assertIn("exactly one pending", report["violations"][0])

    def test_dictionary_can_be_single_answer(self):
        value = {"approved": True, "note": "ship"}
        report = guard.validate(["i1"], {"mode": "single", "value": value})
        self.assertTrue(report["ok"])
        self.assertEqual(report["adapter_resume"], value)

    def test_id_mapping_requires_complete_exact_set(self):
        report = guard.validate(["i1", "i2"], {"mode": "by_id", "responses": {"i1": "yes", "other": "no"}})
        self.assertFalse(report["ok"])
        joined = " ".join(report["violations"])
        self.assertIn("i2", joined)
        self.assertIn("other", joined)

    def test_id_mapping_passes_when_complete(self):
        report = guard.validate(["i1", "i2"], {"mode": "by_id", "responses": {"i1": "yes", "i2": "no"}})
        self.assertTrue(report["ok"])

    def test_duplicate_pending_ids_are_invalid(self):
        with self.assertRaises(ValueError):
            guard.normalize_pending([{"id": "i1"}, {"id": "i1"}])


if __name__ == "__main__":
    unittest.main()
