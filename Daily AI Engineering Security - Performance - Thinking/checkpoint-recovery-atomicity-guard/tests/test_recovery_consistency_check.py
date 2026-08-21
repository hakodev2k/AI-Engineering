import json, subprocess, sys, tempfile, unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "recovery_consistency_check.py"

class RecoveryConsistencyTests(unittest.TestCase):
    def run_case(self, payload):
        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as f:
            json.dump(payload, f); name = f.name
        p = subprocess.run([sys.executable, str(SCRIPT), name], capture_output=True, text=True)
        return p.returncode, json.loads(p.stdout)

    def test_safe_consistent_transition(self):
        code, out = self.run_case({"checkpoint":{"transition_id":"t1"},"pending_writes":[{"transition_id":"t1"}],"side_effects":[{"transition_id":"t1","state":"committed","evidence_ref":"receipt:1"}]})
        self.assertEqual(code, 0); self.assertEqual(out["status"], "safe")

    def test_unknown_effect_blocks(self):
        code, out = self.run_case({"checkpoint":{"transition_id":"t1"},"pending_writes":[],"side_effects":[{"transition_id":"t1","state":"unknown"}]})
        self.assertEqual(code, 3); self.assertEqual(out["decision"], "block-for-reconciliation")

    def test_transition_mismatch_blocks(self):
        code, out = self.run_case({"checkpoint":{"transition_id":"t1"},"pending_writes":[{"transition_id":"t2"}],"side_effects":[]})
        self.assertEqual(code, 3); self.assertTrue(out["errors"])

if __name__ == "__main__": unittest.main()
