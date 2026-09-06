#!/usr/bin/env python3
import json, subprocess, tempfile, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "flag_cleanup_gate.py"
POLICY = ROOT / "config" / "flag-policy.json"

class GateTests(unittest.TestCase):
    def run_gate(self, *args):
        return subprocess.run(["python", str(SCRIPT), *args], text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    def registry(self, path, state="retired", behavior="enabled"):
        path.write_text(json.dumps({"flags":[{"key":"checkout-v2","state":state,"owner":"payments","retired_at":"2026-09-01","expected_behavior":behavior}]}), encoding="utf-8")

    def scan_report(self, path, count=0):
        path.write_text(json.dumps({"status":"pass" if count == 0 else "references-found","flag":"checkout-v2","active_reference_count":count}), encoding="utf-8")

    def test_scan_finds_active_reference(self):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td); (td / "app.py").write_text("if flag('checkout-v2'):\n    pass\n", encoding="utf-8")
            reg = td / "registry.json"; self.registry(reg); out = td / "scan.json"
            p = self.run_gate("scan","--flag","checkout-v2","--root",str(td),"--registry",str(reg),"--policy",str(POLICY),"--out",str(out))
            self.assertEqual(p.returncode, 2)
            self.assertEqual(json.loads(out.read_text())["active_reference_count"], 1)

    def test_scan_excludes_registry_itself(self):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td); reg = td / "registry.json"; self.registry(reg); out = td / "scan.json"
            p = self.run_gate("scan","--flag","checkout-v2","--root",str(td),"--registry",str(reg),"--policy",str(POLICY),"--out",str(out))
            self.assertEqual(p.returncode, 0, p.stderr)
            self.assertEqual(json.loads(out.read_text())["active_reference_count"], 0)

    def test_verify_passes_after_cleanup(self):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td); reg = td / "registry.json"; self.registry(reg)
            scan = td / "scan.json"; self.scan_report(scan, 0); out = td / "verification.json"
            p = self.run_gate("verify","--flag","checkout-v2","--registry",str(reg),"--policy",str(POLICY),"--scan",str(scan),"--out",str(out))
            self.assertEqual(p.returncode, 0, p.stderr)
            self.assertEqual(json.loads(out.read_text())["status"], "verified")

    def test_verify_rejects_nonretired_registry(self):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td); reg = td / "registry.json"; self.registry(reg, state="active")
            scan = td / "scan.json"; self.scan_report(scan, 0); out = td / "verification.json"
            p = self.run_gate("verify","--flag","checkout-v2","--registry",str(reg),"--policy",str(POLICY),"--scan",str(scan),"--out",str(out))
            self.assertEqual(p.returncode, 2)
            self.assertEqual(json.loads(out.read_text())["status"], "failed")

if __name__ == "__main__":
    unittest.main()
