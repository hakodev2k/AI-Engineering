import json, subprocess, tempfile, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "validate_reconnect_trace.py"
POLICY = ROOT / "config" / "reconnect-policy.json"


class ValidatorTests(unittest.TestCase):
    def run_trace(self, trace):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td)
            trace_path = td / "trace.json"
            out = td / "out.json"
            trace_path.write_text(json.dumps(trace), encoding="utf-8")
            p = subprocess.run(["python", str(SCRIPT), "--trace", str(trace_path), "--policy", str(POLICY), "--out", str(out)], text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            return p.returncode, json.loads(out.read_text(encoding="utf-8"))

    def test_valid_reconnect(self):
        trace = {"status":"captured","events":[
            {"type":"connected","attempt":0,"session_id":"a"},
            {"type":"subscribed","subscription":"x"},
            {"type":"message","subscription":"x","sequence":1},
            {"type":"disconnected"},
            {"type":"reconnect_attempt","attempt":1,"backoff_ms":200},
            {"type":"connected","attempt":1,"session_id":"b"},
            {"type":"subscribed","subscription":"x"},
            {"type":"message","subscription":"x","sequence":2}]}
        rc, out = self.run_trace(trace)
        self.assertEqual(rc, 0)
        self.assertEqual(out["status"], "verified")

    def test_duplicate_subscription_fails(self):
        trace = {"status":"captured","events":[
            {"type":"connected","attempt":0},
            {"type":"subscribed","subscription":"x"},
            {"type":"subscribed","subscription":"x"}]}
        rc, out = self.run_trace(trace)
        self.assertEqual(rc, 2)
        self.assertTrue(any("duplicate subscription" in e for e in out["errors"]))

    def test_sequence_gap_fails(self):
        trace = {"status":"captured","events":[
            {"type":"connected","attempt":0},
            {"type":"message","subscription":"x","sequence":1},
            {"type":"message","subscription":"x","sequence":3}]}
        rc, out = self.run_trace(trace)
        self.assertEqual(rc, 2)
        self.assertTrue(any("sequence gap" in e for e in out["errors"]))


if __name__ == "__main__":
    unittest.main()
