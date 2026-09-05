import importlib.util
import pathlib
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "tool_registry_sentinel.py"
spec = importlib.util.spec_from_file_location("sentinel", SCRIPT)
sentinel = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sentinel)


class SentinelTests(unittest.TestCase):
    def test_complete_registry_passes(self):
        r = sentinel.inspect({"advertised_tools":["a","b"],"visible_tools":["a","b"],"required_tools":["b"],"documented_capacity":10})
        self.assertEqual("pass", r["decision"])
        self.assertEqual(1.0, r["required_coverage"])

    def test_missing_required_blocks(self):
        r = sentinel.inspect({"advertised_tools":["a","b"],"visible_tools":["a"],"required_tools":["b"]})
        self.assertEqual("block", r["decision"])
        self.assertEqual(["b"], r["missing_required"])

    def test_nonrequired_truncation_reports_but_does_not_false_fail_task(self):
        r = sentinel.inspect({"advertised_tools":["a","b"],"visible_tools":["a"],"required_tools":["a"]})
        self.assertEqual("pass", r["decision"])
        self.assertTrue(r["findings"])

    def test_capacity_pressure_is_reported(self):
        r = sentinel.inspect({"advertised_tools":["a","b","c"],"visible_tools":["a","b","c"],"required_tools":["a"],"documented_capacity":2})
        self.assertTrue(any("capacity" in x for x in r["findings"]))

    def test_duplicate_tool_rejected(self):
        with self.assertRaises(ValueError):
            sentinel.inspect({"advertised_tools":["a","a"],"visible_tools":["a"],"required_tools":[]})


if __name__ == "__main__":
    unittest.main()
