import importlib.util
from pathlib import Path
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "benchmark_parameter_sets.py"
spec = importlib.util.spec_from_file_location("bench", SCRIPT)
bench = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bench)


class BenchmarkTests(unittest.TestCase):
    def test_render_replaces_all_placeholders(self):
        self.assertEqual(bench.render("cmd --a {a} --b {b}", {"a": 1, "b": "x"}), "cmd --a 1 --b x")

    def test_render_rejects_unresolved_placeholder(self):
        with self.assertRaises(ValueError):
            bench.render("cmd --a {a} --b {b}", {"a": 1})


if __name__ == "__main__":
    unittest.main()
