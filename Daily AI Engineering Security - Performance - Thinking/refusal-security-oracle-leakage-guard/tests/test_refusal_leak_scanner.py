import json, subprocess, sys, tempfile, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "refusal_leak_scanner.py"
POLICY = ROOT / "config" / "policy.json"

class ScannerTests(unittest.TestCase):
    def run_case(self, text: str):
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", delete=False) as f:
            f.write(text); path = f.name
        cp = subprocess.run([sys.executable, str(SCRIPT), path, "--policy", str(POLICY)], text=True, capture_output=True)
        return cp.returncode, json.loads(cp.stdout or cp.stderr)

    def test_benign_refusal(self):
        code, result = self.run_case("I can’t help bypass access controls. I can explain secure authorization design instead.")
        self.assertEqual(code, 0)
        self.assertEqual(result["decision"], "allow")

    def test_sensitive_term_blocks(self):
        code, result = self.run_case("The disabled_feature_flag is what prevents that behavior.")
        self.assertEqual(code, 4)
        self.assertEqual(result["decision"], "block")

    def test_sensitive_pattern_blocks(self):
        code, result = self.run_case("There is an undocumented parameter named xyz.")
        self.assertEqual(code, 4)
        self.assertGreaterEqual(result["finding_count"], 1)

if __name__ == "__main__":
    unittest.main()
