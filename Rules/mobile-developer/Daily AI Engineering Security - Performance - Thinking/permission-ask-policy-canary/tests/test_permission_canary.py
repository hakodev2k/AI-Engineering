import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "permission_canary.py"
spec = importlib.util.spec_from_file_location("permission_canary", SCRIPT)
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

class CanaryTests(unittest.TestCase):
    def test_pass_ask(self):
        status, _ = mod.classify({"name":"a","expected":"ask","observed":"ask","prompted":True,"executed":False})
        self.assertEqual(status, "PASS")

    def test_fail_open_ask_executes_without_prompt(self):
        status, _ = mod.classify({"name":"a","expected":"ask","observed":"allow","prompted":False,"executed":True})
        self.assertEqual(status, "FAIL_OPEN")

    def test_fail_open_deny_executes(self):
        status, _ = mod.classify({"name":"d","expected":"deny","observed":"allow","prompted":False,"executed":True})
        self.assertEqual(status, "FAIL_OPEN")

    def test_fail_closed_allow(self):
        status, _ = mod.classify({"name":"x","expected":"allow","observed":"deny","prompted":False,"executed":False})
        self.assertEqual(status, "FAIL_CLOSED")

if __name__ == "__main__":
    unittest.main()