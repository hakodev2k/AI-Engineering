import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "verify_destination_policy.py"
spec = importlib.util.spec_from_file_location("verifier", SCRIPT)
verifier = importlib.util.module_from_spec(spec)
spec.loader.exec_module(verifier)

POLICY = {"required_controls": ["destination_allowlist", "canonical_host_validation", "redirect_revalidation", "enforce_before_secret_materialization"]}


class DestinationPolicyTests(unittest.TestCase):
    def test_safe_adapter_passes(self):
        inventory = {"adapters": [{"name": "safe", "uses_credential": True, "user_configurable_endpoint": True, "supports_shared_use_only_credentials": True, "controls": {key: True for key in POLICY["required_controls"]}, "negative_tests": [{"case": "disallowed_destination", "passed": True}]}]}
        self.assertTrue(verifier.evaluate(POLICY, inventory)["passed"])

    def test_missing_pre_secret_enforcement_blocks(self):
        controls = {key: True for key in POLICY["required_controls"]}
        controls["enforce_before_secret_materialization"] = False
        inventory = {"adapters": [{"name": "unsafe", "uses_credential": True, "user_configurable_endpoint": True, "supports_shared_use_only_credentials": True, "controls": controls, "negative_tests": [{"case": "disallowed_destination", "passed": True}]}]}
        report = verifier.evaluate(POLICY, inventory)
        self.assertFalse(report["passed"])
        self.assertTrue(any(v["severity"] == "critical" for v in report["violations"]))

    def test_missing_negative_test_blocks(self):
        inventory = {"adapters": [{"name": "untested", "uses_credential": True, "user_configurable_endpoint": True, "controls": {key: True for key in POLICY["required_controls"]}, "negative_tests": []}]}
        self.assertFalse(verifier.evaluate(POLICY, inventory)["passed"])


if __name__ == "__main__":
    unittest.main()
