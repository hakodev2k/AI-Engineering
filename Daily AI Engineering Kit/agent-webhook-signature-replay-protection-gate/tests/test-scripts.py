import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load(name, file):
    spec = importlib.util.spec_from_file_location(name, ROOT / "scripts" / file)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


scan = load("scan", "scan-webhook-security.py")
replay = load("replay", "simulate-replay-window.py")
evidence = load("evidence", "validate-evidence.py")


class GateTests(unittest.TestCase):
    def test_replay_window_boundaries(self):
        self.assertTrue(replay.in_window(100, 400, 300))
        self.assertFalse(replay.in_window(99, 400, 300))

    def test_replay_key_is_stable_and_changes(self):
        a = replay.replay_key("event-1", "sig")
        self.assertEqual(a, replay.replay_key("event-1", "sig"))
        self.assertNotEqual(a, replay.replay_key("event-2", "sig"))

    def test_scanner_detects_missing_replay(self):
        cfg = json.loads((ROOT / "config" / "gate.json").read_text())
        with tempfile.TemporaryDirectory() as td:
            p = Path(td) / "webhook.py"
            p.write_text("def webhook(request):\n    signature=request.headers['signature']\n    raw_body=request.body\n    timestamp=request.headers['timestamp']\n    return verify(signature, raw_body)\n")
            item = scan.scan_file(p, cfg)
            codes = {f["code"] for f in item["findings"]}
            self.assertIn("missing-replay", codes)
            self.assertNotIn("missing-signature", codes)

    def test_verified_evidence_cannot_contain_failure(self):
        data = {
            "topic": "agent-webhook-signature-replay-protection-gate",
            "status": "verified",
            "boundaries": [{"component": "x"}],
            "checks": [{"name": str(i), "status": "pass", "evidence": "x"} for i in range(5)],
            "verification_status": "verified",
            "verifier": "independent",
            "risks": []
        }
        self.assertEqual([], evidence.validate(data))
        data["checks"][0]["status"] = "fail"
        self.assertTrue(evidence.validate(data))


if __name__ == "__main__":
    unittest.main()
