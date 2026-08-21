import json
import tempfile
import unittest
from pathlib import Path

import importlib.util

MODULE = Path(__file__).resolve().parents[1] / "scripts" / "classify_test_signal.py"
spec = importlib.util.spec_from_file_location("classifier", MODULE)
classifier = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(classifier)

POLICY = {
    "mixed_outcome_classification": "FLAKY_OR_NONDETERMINISTIC",
    "infrastructure_markers": ["ECONNRESET", "503 Service Unavailable"],
}


class ClassifierTests(unittest.TestCase):
    def test_all_pass(self):
        rows = [{"exit_code": 0, "timed_out": False, "stdout": "ok", "stderr": ""} for _ in range(3)]
        result = classifier.classify(rows, POLICY)
        self.assertEqual(result["classification"], "CONSISTENT_PASS")

    def test_mixed_is_never_clean_pass(self):
        rows = [
            {"exit_code": 1, "timed_out": False, "stdout": "AssertionError: x", "stderr": ""},
            {"exit_code": 0, "timed_out": False, "stdout": "ok", "stderr": ""},
            {"exit_code": 0, "timed_out": False, "stdout": "ok", "stderr": ""},
        ]
        result = classifier.classify(rows, POLICY)
        self.assertEqual(result["classification"], "FLAKY_OR_NONDETERMINISTIC")

    def test_same_failure_fingerprint_is_deterministic(self):
        rows = [
            {"exit_code": 1, "timed_out": False, "stdout": f"2026-08-20T00:00:0{i}Z\nAssertionError: expected 1 got 2", "stderr": ""}
            for i in range(3)
        ]
        result = classifier.classify(rows, POLICY)
        self.assertEqual(result["classification"], "DETERMINISTIC_FAILURE")
        self.assertEqual(len(result["fingerprints"]), 1)

    def test_different_failures_are_nondeterministic(self):
        rows = [
            {"exit_code": 1, "timed_out": False, "stdout": "AssertionError: A", "stderr": ""},
            {"exit_code": 1, "timed_out": False, "stdout": "Timeout while waiting for B", "stderr": ""},
        ]
        result = classifier.classify(rows, POLICY)
        self.assertEqual(result["classification"], "FLAKY_OR_NONDETERMINISTIC")

    def test_infrastructure_markers(self):
        rows = [
            {"exit_code": 1, "timed_out": False, "stdout": "", "stderr": "ECONNRESET contacting dependency"},
            {"exit_code": 1, "timed_out": False, "stdout": "", "stderr": "ECONNRESET contacting dependency"},
        ]
        result = classifier.classify(rows, POLICY)
        self.assertEqual(result["classification"], "LIKELY_INFRASTRUCTURE")

    def test_timestamp_normalization_keeps_stable_fingerprint(self):
        a = classifier.normalize("2026-08-20T01:02:03Z AssertionError: boom")
        b = classifier.normalize("2026-08-20T01:02:59Z AssertionError: boom")
        self.assertEqual(a, b)


if __name__ == "__main__":
    unittest.main()
