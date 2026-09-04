import json
import tempfile
import unittest
from pathlib import Path
import importlib.util

MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "scan-outbox-risk.py"
spec = importlib.util.spec_from_file_location("scan_outbox_risk", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class ScanOutboxRiskTests(unittest.TestCase):
    def config(self):
        return {
            "source_roots": ["src"],
            "exclude_dirs": [".git", "bin", "obj"],
            "transaction_patterns": ["transaction", "savechanges"],
            "publish_patterns": ["publish"],
            "outbox_patterns": ["outbox"],
            "dispatcher_patterns": ["worker", "dispatcher"],
            "max_file_bytes": 100000
        }

    def test_flags_transaction_and_publish_without_outbox(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            src = repo / "src"
            src.mkdir()
            (src / "handler.cs").write_text("using transaction; SaveChanges(); publisher.Publish(evt);", encoding="utf-8")
            findings = module.scan(repo, self.config())
            self.assertTrue(any(f["type"] == "possible-dual-write" for f in findings))

    def test_does_not_flag_atomic_outbox_as_high(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            src = repo / "src"
            src.mkdir()
            (src / "handler.cs").write_text("using transaction; SaveChanges(); Outbox.Add(evt);", encoding="utf-8")
            findings = module.scan(repo, self.config())
            self.assertFalse(any(f["severity"] == "high" for f in findings))

    def test_config_loader_rejects_missing_required_key(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "config.json"
            path.write_text(json.dumps({"source_roots": []}), encoding="utf-8")
            with self.assertRaises(ValueError):
                module.load_config(path)


if __name__ == "__main__":
    unittest.main()
