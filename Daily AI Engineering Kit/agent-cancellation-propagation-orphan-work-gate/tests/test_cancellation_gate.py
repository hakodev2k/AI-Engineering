import importlib.util, tempfile, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("gate",ROOT/"scripts/cancellation_gate.py")
gate=importlib.util.module_from_spec(spec); spec.loader.exec_module(gate)

class GateTests(unittest.TestCase):
    def test_detects_blocking_pattern(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d); (root/"a.cs").write_text("var x = CancellationToken.None;",encoding="utf-8")
            cfg={"source_extensions":[".cs"],"blocking_severity":"high","risky_patterns":[{"pattern":"CancellationToken.None","severity":"high","reason":"discarded"}],"suppressions":[]}
            report=gate.scan(root,cfg)
            self.assertEqual("failed",report["status"]); self.assertEqual(1,report["summary"]["blocking_count"])
    def test_clean_source_passes(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d); (root/"a.py").write_text("async def f(stop):\n    if stop.is_set(): return\n",encoding="utf-8")
            cfg={"source_extensions":[".py"],"blocking_severity":"high","risky_patterns":[{"pattern":"create_task(","severity":"high","reason":"spawn"}],"suppressions":[]}
            self.assertEqual("passed",gate.scan(root,cfg)["status"])

if __name__=="__main__": unittest.main()
