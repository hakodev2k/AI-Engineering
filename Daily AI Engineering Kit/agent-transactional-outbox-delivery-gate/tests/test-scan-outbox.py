import importlib.util, pathlib, tempfile, unittest, json

SCRIPT = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "scan-outbox.py"
spec = importlib.util.spec_from_file_location("scan_outbox", SCRIPT)
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

class ScanHelpersTest(unittest.TestCase):
    def test_contains_is_case_insensitive(self):
        self.assertTrue(mod.contains("Transactional OUTBOX writer", ["outbox"]))
        self.assertFalse(mod.contains("ordinary repository", ["outbox"]))

    def test_config_shape_example(self):
        cfg_path = pathlib.Path(__file__).resolve().parents[1] / "config" / "outbox-gate.json"
        cfg = json.loads(cfg_path.read_text(encoding="utf-8"))
        self.assertIn("outbox", [x.lower() for x in cfg["outbox_terms"]])
        self.assertEqual(cfg["max_high_findings"], 0)

if __name__ == "__main__": unittest.main()
