import importlib.util
import pathlib
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "validate_checkpoint.py"
spec = importlib.util.spec_from_file_location("validator", SCRIPT)
validator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validator)


def valid():
    return {
        "version": 1, "goal_id": "g1", "goal": "finish task", "status": "in_progress",
        "completion_criteria": ["tests pass"], "pending_work": ["run tests"],
        "evidence": [], "resume_mode": "autonomous"
    }


class Tests(unittest.TestCase):
    def test_valid_in_progress(self):
        self.assertEqual([], validator.validate(valid()))

    def test_blocks_in_progress_without_pending_work(self):
        c = valid(); c["pending_work"] = []
        self.assertTrue(any("pending_work" in x for x in validator.validate(c)))

    def test_completed_requires_empty_pending(self):
        c = valid(); c["status"] = "completed"
        self.assertTrue(any("completed" in x for x in validator.validate(c)))

    def test_blocks_secret_fields(self):
        c = valid(); c["metadata"] = {"api_key": "abc"}
        self.assertTrue(any("secret" in x for x in validator.validate(c)))

    def test_completed_valid_with_evidence(self):
        c = valid(); c["status"] = "completed"; c["pending_work"] = []; c["evidence"] = ["test-run-1"]
        self.assertEqual([], validator.validate(c))


if __name__ == "__main__":
    unittest.main()
