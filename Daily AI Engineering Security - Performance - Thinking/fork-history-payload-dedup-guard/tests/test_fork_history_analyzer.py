import importlib.util, json, pathlib, tempfile, unittest

MODULE = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "fork_history_analyzer.py"
spec = importlib.util.spec_from_file_location("fork_history_analyzer", MODULE)
fha = importlib.util.module_from_spec(spec); assert spec and spec.loader; spec.loader.exec_module(fha)

class ForkHistoryAnalyzerTests(unittest.TestCase):
    def write_lines(self, path, rows):
        path.write_text("".join(json.dumps(r) + "\n" for r in rows), encoding="utf-8")

    def test_latest_compaction_projection(self):
        with tempfile.TemporaryDirectory() as d:
            p = pathlib.Path(d) / "r.jsonl"
            self.write_lines(p, [
                {"type":"message","payload":{"text":"old"}},
                {"type":"compacted","payload":{"replacement_history":[{"text":"state1"}]}},
                {"type":"message","payload":{"text":"middle"}},
                {"type":"compacted","payload":{"replacement_history":[{"text":"state2"}]}},
                {"type":"message","payload":{"text":"new"}},
            ])
            result = fha.analyze(p, 16)
            self.assertEqual(2, result["compacted_records"])
            self.assertEqual(3, result["latest_compaction_record_index"])
            self.assertLess(result["projected_effective_bytes"], result["total_bytes"])
            self.assertGreater(result["superseded_compaction_bytes_estimate"], 0)

    def test_duplicate_large_strings_counted(self):
        with tempfile.TemporaryDirectory() as d:
            p = pathlib.Path(d) / "r.jsonl"
            big = "data:image/png;base64," + "A" * 100
            self.write_lines(p, [{"type":"message","image":big},{"type":"message","image":big}])
            result = fha.analyze(p, 32)
            self.assertGreater(result["duplicate_large_string_bytes"], 0)
            self.assertEqual(1, result["unique_large_string_hashes"])

    def test_invalid_record_disables_projection(self):
        with tempfile.TemporaryDirectory() as d:
            p = pathlib.Path(d) / "r.jsonl"
            p.write_text('{"type":"message"}\nnot-json\n', encoding="utf-8")
            result = fha.analyze(p, 16)
            self.assertEqual(1, result["invalid_records"])
            self.assertIsNone(result["projected_effective_bytes"])

if __name__ == "__main__": unittest.main()
