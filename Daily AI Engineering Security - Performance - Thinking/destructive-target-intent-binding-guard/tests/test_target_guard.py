import json
import tempfile
import unittest
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import target_guard

POLICY = {"review_recursive": True, "review_unrecoverable": True}


class TargetGuardTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name).resolve()
        self.file = self.root / "build" / "cache.tmp"
        self.file.parent.mkdir()
        self.file.write_text("x", encoding="utf-8")

    def tearDown(self):
        self.tmp.cleanup()

    def req(self, **changes):
        value = {
            "operation": "delete",
            "cwd": str(self.root),
            "allowed_roots": [str(self.root)],
            "authorized_targets": [str(self.file)],
            "targets": [str(self.file)],
            "recursive": False,
            "recoverable": True,
        }
        value.update(changes)
        return value

    def test_exact_recoverable_target_allowed(self):
        self.assertEqual(target_guard.evaluate(self.req(), POLICY)["decision"], "allow")

    def test_target_not_in_authorized_manifest_blocks(self):
        other = self.root / "other.txt"
        result = target_guard.evaluate(self.req(targets=[str(other)]), POLICY)
        self.assertEqual(result["decision"], "block")
        self.assertIn("target-not-authorized", {x["code"] for x in result["findings"]})

    def test_outside_root_blocks(self):
        outside = self.root.parent / "outside.txt"
        result = target_guard.evaluate(self.req(targets=[str(outside)], authorized_targets=[str(outside)]), POLICY)
        self.assertEqual(result["decision"], "block")
        self.assertIn("outside-allowed-root", {x["code"] for x in result["findings"]})

    def test_pattern_target_blocks(self):
        result = target_guard.evaluate(self.req(targets=["build/*.tmp"]), POLICY)
        self.assertEqual(result["decision"], "block")
        self.assertIn("ambiguous-target-expression", {x["code"] for x in result["findings"]})

    def test_recursive_operation_requires_review(self):
        directory = self.file.parent
        result = target_guard.evaluate(self.req(targets=[str(directory)], authorized_targets=[str(directory)], recursive=True), POLICY)
        self.assertEqual(result["decision"], "review")

    def test_recursive_allowed_root_blocks(self):
        result = target_guard.evaluate(self.req(targets=[str(self.root)], authorized_targets=[str(self.root)], recursive=True), POLICY)
        self.assertEqual(result["decision"], "block")
        self.assertIn("recursive-allowed-root", {x["code"] for x in result["findings"]})

    def test_unrecoverable_operation_requires_review(self):
        result = target_guard.evaluate(self.req(recoverable=False), POLICY)
        self.assertEqual(result["decision"], "review")


if __name__ == "__main__":
    unittest.main()
