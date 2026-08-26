import json, os, tempfile, unittest
from pathlib import Path
from scripts.path_gate import evaluate

POLICY = {
    "allow_operations": ["read", "write", "edit", "create"],
    "deny_prefixes": [".git", ".ssh"],
    "require_human_approval_outside_workspace": True,
    "fail_closed_on_resolution_error": True,
}

class PathGateTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.ws = self.root / "project"
        self.ws.mkdir()
        (self.ws / "src").mkdir()
        (self.ws / ".git").mkdir()
        (self.ws / "src" / "a.txt").write_text("x", encoding="utf-8")
        self.outside = self.root / "secret.txt"
        self.outside.write_text("secret", encoding="utf-8")
    def tearDown(self): self.tmp.cleanup()
    def test_inside_allowed(self):
        self.assertTrue(evaluate(POLICY, self.ws, "src/a.txt", "read")["ok"])
    def test_parent_traversal_blocked(self):
        self.assertFalse(evaluate(POLICY, self.ws, "../secret.txt", "read")["ok"])
    def test_new_file_inside_allowed(self):
        self.assertTrue(evaluate(POLICY, self.ws, "src/new.txt", "create")["ok"])
    def test_denied_prefix_blocked(self):
        self.assertFalse(evaluate(POLICY, self.ws, ".git/config", "write")["ok"])
    def test_symlink_escape_blocked(self):
        link = self.ws / "link"
        try:
            link.symlink_to(self.root, target_is_directory=True)
        except (OSError, NotImplementedError):
            self.skipTest("symlink unavailable")
        r = evaluate(POLICY, self.ws, "link/secret.txt", "read")
        self.assertFalse(r["ok"])
        self.assertEqual(r["reason"], "outside_workspace")
    def test_missing_parent_fails_closed(self):
        r = evaluate(POLICY, self.ws, "missing/child.txt", "create")
        self.assertFalse(r["ok"])
        self.assertEqual(r["reason"], "resolution_error")

if __name__ == "__main__": unittest.main()
