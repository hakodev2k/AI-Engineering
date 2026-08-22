import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "evaluate_boundary.py"
spec = importlib.util.spec_from_file_location("evaluate_boundary", SCRIPT)
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

class BoundaryTests(unittest.TestCase):
    def test_pass_deny(self):
        status, _ = mod.classify({"name":"w","expected":"deny","observed":"deny"})
        self.assertEqual(status, "PASS")

    def test_fail_open(self):
        status, _ = mod.classify({"name":"w","expected":"deny","observed":"allow"})
        self.assertEqual(status, "FAIL_OPEN")

    def test_fail_closed(self):
        status, _ = mod.classify({"name":"r","expected":"allow","observed":"deny"})
        self.assertEqual(status, "FAIL_CLOSED")

    def test_unknown(self):
        status, _ = mod.classify({"name":"x","expected":"deny","observed":"unknown"})
        self.assertEqual(status, "UNKNOWN")

if __name__ == "__main__": unittest.main()
