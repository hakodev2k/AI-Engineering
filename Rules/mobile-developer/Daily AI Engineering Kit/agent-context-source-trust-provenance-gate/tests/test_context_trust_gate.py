import importlib.util
import json
import unittest
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("context_trust_gate", ROOT / "scripts" / "context_trust_gate.py")
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)
POLICY = json.loads((ROOT / "config" / "trust-policy.json").read_text(encoding="utf-8"))


class ContextTrustGateTests(unittest.TestCase):
    def test_pass_example_verifies(self):
        manifest = json.loads((ROOT / "examples" / "context-manifest-pass.json").read_text(encoding="utf-8"))
        result = MODULE.evaluate(manifest, POLICY, datetime(2026, 8, 21, tzinfo=timezone.utc))
        self.assertEqual("verified", result["status"])
        self.assertGreaterEqual(result["score"], POLICY["minimum_overall_score"])
        self.assertEqual([], result["errors"])

    def test_block_example_is_rejected(self):
        manifest = json.loads((ROOT / "examples" / "context-manifest-block.json").read_text(encoding="utf-8"))
        result = MODULE.evaluate(manifest, POLICY, datetime(2026, 8, 21, tzinfo=timezone.utc))
        self.assertEqual("blocked", result["status"])
        self.assertTrue(any("blocked source pattern" in e for e in result["errors"]))
        self.assertTrue(any("observed_at" in e for e in result["errors"]))

    def test_unknown_claim_source_blocks(self):
        manifest = json.loads((ROOT / "examples" / "context-manifest-pass.json").read_text(encoding="utf-8"))
        manifest["claims"][0]["source_ids"] = ["missing"]
        result = MODULE.evaluate(manifest, POLICY, datetime(2026, 8, 21, tzinfo=timezone.utc))
        self.assertEqual("blocked", result["status"])
        self.assertTrue(any("unknown sources" in e for e in result["errors"]))


if __name__ == "__main__":
    unittest.main()
