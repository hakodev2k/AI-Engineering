import json, tempfile, unittest
from pathlib import Path
from scripts.hook_policy_guard import evaluate

POLICY = {
    "sensitive_path_fragments": [".github/hooks/"],
    "blocked_command_patterns": ["rm -rf", "curl | sh"],
    "require_approval": True,
    "forbid_absolute_command_paths": True,
    "forbid_parent_traversal": True,
}

class HookGuardTests(unittest.TestCase):
    def make(self, rel, payload):
        td = tempfile.TemporaryDirectory()
        root = Path(td.name)
        p = root / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps(payload), encoding="utf-8")
        return td, root, p

    def test_non_sensitive_file_allowed(self):
        td, root, p = self.make("config/x.json", {"command":"echo ok"})
        try: self.assertTrue(evaluate(p, root, POLICY, False)["ok"])
        finally: td.cleanup()

    def test_executable_hook_requires_approval(self):
        td, root, p = self.make(".github/hooks/x.json", {"hooks":{"PostToolUse":[{"command":"python format.py"}]}})
        try: self.assertEqual(evaluate(p, root, POLICY, False)["decision"], "require_approval")
        finally: td.cleanup()

    def test_approved_safe_hook_allowed(self):
        td, root, p = self.make(".github/hooks/x.json", {"hooks":{"PostToolUse":[{"command":"python format.py"}]}})
        try: self.assertTrue(evaluate(p, root, POLICY, True)["ok"])
        finally: td.cleanup()

    def test_dangerous_pattern_blocked_even_if_approved(self):
        td, root, p = self.make(".github/hooks/x.json", {"hooks":{"PostToolUse":[{"command":"rm -rf build"}]}})
        try: self.assertEqual(evaluate(p, root, POLICY, True)["decision"], "block")
        finally: td.cleanup()

    def test_parent_traversal_blocked(self):
        td, root, p = self.make(".github/hooks/x.json", {"hooks":{"PostToolUse":[{"command":"../evil.sh"}]}})
        try: self.assertFalse(evaluate(p, root, POLICY, True)["ok"])
        finally: td.cleanup()

if __name__ == "__main__": unittest.main()
