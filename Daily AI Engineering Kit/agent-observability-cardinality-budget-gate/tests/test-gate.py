#!/usr/bin/env python3
import json
from pathlib import Path
import subprocess, sys, tempfile, unittest

ROOT = Path(__file__).resolve().parents[1]
SCAN = ROOT / "scripts" / "scan-cardinality.py"
ANALYZE = ROOT / "scripts" / "analyze-sample.py"
VERIFY = ROOT / "scripts" / "verify-evidence.py"
CONFIG = ROOT / "config" / "cardinality-policy.json"

class GateTests(unittest.TestCase):
    def run_cmd(self, *args):
        return subprocess.run([sys.executable, *map(str, args)], text=True, capture_output=True)

    def test_scanner_blocks_dangerous_metric_dimension(self):
        with tempfile.TemporaryDirectory() as td:
            repo = Path(td)/"repo"; repo.mkdir(); (repo/"app.py").write_text('meter.counter("requests").record(1, {"user_id": user.id})\n', encoding="utf-8")
            out = Path(td)/"scan.json"; cp = self.run_cmd(SCAN,"--repo",repo,"--config",CONFIG,"--output",out)
            self.assertEqual(cp.returncode,2,cp.stderr); report=json.loads(out.read_text()); self.assertGreater(report["blocking_count"],0)

    def test_scanner_accepts_bounded_dimension(self):
        with tempfile.TemporaryDirectory() as td:
            repo=Path(td)/"repo"; repo.mkdir(); (repo/"app.py").write_text('meter.counter("requests").record(1, {"method": method})\n', encoding="utf-8")
            out=Path(td)/"scan.json"; cp=self.run_cmd(SCAN,"--repo",repo,"--config",CONFIG,"--output",out); self.assertEqual(cp.returncode,0,cp.stderr)

    def test_scanner_excludes_gate_package_itself(self):
        with tempfile.TemporaryDirectory() as td:
            out=Path(td)/"scan.json"; cp=self.run_cmd(SCAN,"--repo",ROOT,"--config",CONFIG,"--output",out)
            self.assertEqual(cp.returncode,0,cp.stderr); report=json.loads(out.read_text()); self.assertEqual(report["blocking_count"],0)

    def test_sample_analyzer_blocks_unique_request_ids(self):
        with tempfile.TemporaryDirectory() as td:
            sample=Path(td)/"sample.jsonl"; sample.write_text("".join(json.dumps({"attributes":{"request_id":f"r-{i}","method":"GET"}})+"\n" for i in range(25)),encoding="utf-8")
            out=Path(td)/"sample.json"; cp=self.run_cmd(ANALYZE,"--input",sample,"--config",CONFIG,"--output",out); self.assertEqual(cp.returncode,2,cp.stderr)

    def test_evidence_validator_accepts_verified_contract(self):
        with tempfile.TemporaryDirectory() as td:
            evidence=Path(td)/"evidence.json"; evidence.write_text(json.dumps({"task":"bound route labels","status":"executed","facts":["route uses template"],"findings":[],"commands":[{"command":"tests","exit_code":0}],"verification_status":"verified","remaining_risks":[]}),encoding="utf-8")
            cp=self.run_cmd(VERIFY,"--evidence",evidence); self.assertEqual(cp.returncode,0,cp.stderr)

if __name__ == "__main__": unittest.main()
