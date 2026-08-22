import json, subprocess, sys, tempfile, unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "discovery_gate.py"

class GateTests(unittest.TestCase):
    def run_gate(self, task, loaded="", searched=""):
        with tempfile.TemporaryDirectory() as d:
            reg = Path(d) / "r.json"
            reg.write_text(json.dumps({"capabilities":[{"id":"history","intents":["prior session"]}]}), encoding="utf-8")
            return subprocess.run([sys.executable, str(SCRIPT), "--registry", str(reg), "--task", task, "--decision", "decline", "--loaded", loaded, "--searched", searched], capture_output=True, text=True)

    def test_requires_discovery_for_matching_unseen_capability(self):
        p = self.run_gate("Find this in a prior session")
        self.assertEqual(p.returncode, 2)
        self.assertEqual(json.loads(p.stdout)["decision"], "discover")

    def test_allows_after_capability_was_searched(self):
        p = self.run_gate("Find this in a prior session", searched="history")
        self.assertEqual(p.returncode, 0)

    def test_allows_irrelevant_task(self):
        p = self.run_gate("Compile the project")
        self.assertEqual(p.returncode, 0)

if __name__ == "__main__": unittest.main()
