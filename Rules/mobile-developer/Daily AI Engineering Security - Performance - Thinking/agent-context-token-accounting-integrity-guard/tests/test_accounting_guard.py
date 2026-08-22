#!/usr/bin/env python3
import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("accounting_guard", ROOT / "scripts" / "accounting_guard.py")
MOD = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(MOD)

POLICY = {
    "max_occupancy_ratio_without_serialized_recheck": 1.0,
    "max_estimator_error_ratio": 0.20,
    "require_transcript_revision_binding": True,
    "allow_cumulative_usage_as_occupancy": False,
    "require_post_compaction_remeasurement": True,
    "recognized_sources": ["provider_input_tokens", "serialized_prompt_tokenizer", "calibrated_estimator"],
}


def base():
    return {
        "current_context_tokens": 80000,
        "current_context_source": "provider_input_tokens",
        "context_window_tokens": 370000,
        "cumulative_usage_tokens": 1500000,
        "transcript_revision": "r1",
        "measurement_revision": "r1",
        "post_compaction": False,
        "remeasured_after_compaction": True,
        "estimated_context_tokens": 82000,
        "reference_context_tokens": 80000,
    }


class AccountingGuardTests(unittest.TestCase):
    def test_valid_current_context_is_safe(self):
        result = MOD.validate(base(), POLICY)
        self.assertEqual(result["decision"], "safe")

    def test_stale_revision_fails(self):
        value = base(); value["measurement_revision"] = "old"
        self.assertEqual(MOD.validate(value, POLICY)["decision"], "integrity_failure")

    def test_post_compaction_requires_remeasurement(self):
        value = base(); value["post_compaction"] = True; value["remeasured_after_compaction"] = False
        self.assertEqual(MOD.validate(value, POLICY)["decision"], "integrity_failure")

    def test_run_sum_inflation_fails(self):
        value = base(); value["current_context_tokens"] = 1515840; value["cumulative_usage_tokens"] = 1515840
        self.assertEqual(MOD.validate(value, POLICY)["decision"], "integrity_failure")

    def test_estimator_error_fails(self):
        value = base(); value["estimated_context_tokens"] = 120000
        self.assertEqual(MOD.validate(value, POLICY)["decision"], "integrity_failure")


if __name__ == "__main__":
    unittest.main()
