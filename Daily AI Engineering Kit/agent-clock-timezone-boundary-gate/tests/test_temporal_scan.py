import json, tempfile, unittest
from pathlib import Path
from unittest.mock import patch
import importlib.util

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("scan",ROOT/"scripts"/"temporal_scan.py")
scan=importlib.util.module_from_spec(spec); spec.loader.exec_module(scan)

class TemporalScanTests(unittest.TestCase):
    def test_detects_wall_clock_and_timezone(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d); (root/"a.cs").write_text("var now = DateTime.Now;\nvar z = TimeZoneInfo.Utc;",encoding="utf-8")
            out=root/"out.json"
            with patch("sys.argv",["scan","--root",str(root),"--output",str(out)]): self.assertEqual(scan.main(),0)
            data=json.loads(out.read_text(encoding="utf-8")); kinds={x["kind"] for x in data["findings"]}
            self.assertIn("wall_clock",kinds); self.assertIn("timezone_conversion",kinds)

    def test_skips_build_directories(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d); (root/"bin").mkdir(); (root/"bin"/"a.cs").write_text("DateTime.Now",encoding="utf-8")
            out=root/"out.json"
            with patch("sys.argv",["scan","--root",str(root),"--output",str(out)]): self.assertEqual(scan.main(),0)
            self.assertEqual(json.loads(out.read_text())["finding_count"],0)

if __name__=="__main__": unittest.main()
