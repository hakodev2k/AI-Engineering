import importlib.util, json, pathlib, tempfile, unittest

MODULE = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "rollout_fidelity.py"
spec = importlib.util.spec_from_file_location("rollout_fidelity", MODULE)
rf = importlib.util.module_from_spec(spec); assert spec and spec.loader; spec.loader.exec_module(rf)

class FidelityTests(unittest.TestCase):
    def write(self, rows):
        f = tempfile.NamedTemporaryFile("w", encoding="utf-8", delete=False)
        with f:
            for row in rows: f.write(json.dumps(row) + "\n")
        return f.name

    def test_identical_ledgers_match(self):
        rows = [{"ordinal": 1, "item": "a"}, {"ordinal": 2, "item": "b"}]
        a, b = self.write(rows), self.write(rows)
        self.assertEqual(rf.scan(a, set())["fingerprints"], rf.scan(b, set())["fingerprints"])

    def test_duplicate_changes_multiplicity(self):
        a = rf.scan(self.write([{"ordinal": 1, "item": "a"}]), set())
        b = rf.scan(self.write([{"ordinal": 1, "item": "a"}, {"ordinal": 1, "item": "a"}]), set())
        self.assertNotEqual(len(a["fingerprints"]), len(b["fingerprints"]))
        self.assertGreater(b["ordinal_regressions"], 0)

    def test_parse_error_is_recorded(self):
        f = tempfile.NamedTemporaryFile("w", encoding="utf-8", delete=False)
        with f: f.write('{"ordinal":1}\nnot-json\n')
        self.assertEqual(rf.scan(f.name, set())["parse_errors"], [2])

if __name__ == "__main__": unittest.main()
