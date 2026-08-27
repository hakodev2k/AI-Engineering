import tempfile
import unittest
from pathlib import Path
from scripts.write_gate import evaluate

POLICY = {"workspace_relative_patterns":[".vscode/tasks.json",".github/workflows/**","**/mcp.json"],"home_relative_patterns":[".kiro/settings/mcp.json"],"always_block_patterns":["/etc/**"],"require_human_approval":True,"allow_outside_workspace":False,"resolve_symlinks":True}

class WriteGateTests(unittest.TestCase):
    def test_ordinary_source_write_allowed(self):
        with tempfile.TemporaryDirectory() as d:
            self.assertEqual(evaluate({"path":"src/app.py","workspace_root":d}, POLICY)["decision"], "allow")
    def test_sensitive_write_requires_approval(self):
        with tempfile.TemporaryDirectory() as d:
            self.assertEqual(evaluate({"path":".vscode/tasks.json","workspace_root":d}, POLICY)["decision"], "require_approval")
    def test_approved_sensitive_write_allowed(self):
        with tempfile.TemporaryDirectory() as d:
            self.assertEqual(evaluate({"path":".vscode/tasks.json","workspace_root":d,"human_approved":True}, POLICY)["decision"], "allow")
    def test_outside_workspace_blocked(self):
        with tempfile.TemporaryDirectory() as d:
            self.assertEqual(evaluate({"path":str(Path(d).parent/"escape.txt"),"workspace_root":d}, POLICY)["decision"], "block")

if __name__ == "__main__": unittest.main()
