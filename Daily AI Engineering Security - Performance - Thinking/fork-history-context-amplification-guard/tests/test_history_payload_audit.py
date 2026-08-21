import importlib.util, json, pathlib, tempfile, unittest
MODULE = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "history_payload_audit.py"
spec = importlib.util.spec_from_file_location("history_payload_audit", MODULE)
h = importlib.util.module_from_spec(spec); assert spec and spec.loader; spec.loader.exec_module(h)

class AuditTests(unittest.TestCase):
    def test_detects_duplicate_blob_and_compaction(self):
        blob = "QUJDRA=="
        rows = [
            {"type":"compacted","replacement_history":[{"type":"input_image","image_url":"data:image/png;base64,"+blob}]},
            {"type":"message","image":"data:image/png;base64,"+blob},
        ]
        with tempfile.TemporaryDirectory() as d:
            p = pathlib.Path(d)/"r.jsonl"
            p.write_text("\n".join(json.dumps(x) for x in rows)+"\n", encoding="utf-8")
            cfg = dict(h.DEFAULTS); cfg["max_duplicate_blob_bytes"] = 1
            r = h.audit(p, cfg)
            self.assertEqual(r["compaction_records"], 1)
            self.assertGreater(r["duplicate_blob_encoded_bytes"], 0)
            self.assertIn("max_duplicate_blob_bytes", r["violations"])

    def test_malformed_line_blocks(self):
        with tempfile.TemporaryDirectory() as d:
            p = pathlib.Path(d)/"r.jsonl"; p.write_text('{bad}\n', encoding="utf-8")
            r = h.audit(p, dict(h.DEFAULTS))
            self.assertEqual(r["status"], "block")
            self.assertEqual(r["malformed_lines"], [1])

if __name__ == "__main__": unittest.main()
