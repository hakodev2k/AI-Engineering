#!/usr/bin/env python3
import json
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "dlq_replay_gate.py"
POLICY = ROOT / "config" / "replay-policy.json"

class GateTests(unittest.TestCase):
    def run_gate(self, *args):
        return subprocess.run(["python", str(SCRIPT), *args], text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    def test_plan_classifies_messages(self):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td); src = td / "messages.jsonl"
            src.write_text('{"message_id":"a","idempotency_key":"k-a","failed_at":"2026-09-06T10:00:00Z","failure_class":"transient","failure_reason":"503","payload":{}}\n{"message_id":"b","idempotency_key":null,"failed_at":"2026-09-06T10:01:00Z","failure_class":"transient","failure_reason":"503","payload":{}}\n{"message_id":"c","idempotency_key":"k-c","failed_at":"2026-09-06T10:02:00Z","failure_class":"schema-invalid","failure_reason":"bad schema","payload":{}}\n', encoding="utf-8")
            out = td / "plan.json"; p = self.run_gate("plan", "--input", str(src), "--policy", str(POLICY), "--environment", "staging", "--now", "2026-09-06T12:00:00Z", "--out", str(out))
            self.assertEqual(p.returncode, 2); doc = json.loads(out.read_text()); statuses = {m["message_id"]: m["status"] for m in doc["messages"]}; self.assertEqual(statuses, {"a": "eligible", "b": "needs-review", "c": "blocked"})

    def test_duplicate_idempotency_key_is_blocked(self):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td); src = td / "messages.jsonl"
            src.write_text('\n'.join([json.dumps({"message_id":"a","idempotency_key":"same","failed_at":"2026-09-06T10:00:00Z","failure_class":"transient","failure_reason":"503","payload":{}}), json.dumps({"message_id":"b","idempotency_key":"same","failed_at":"2026-09-06T10:00:00Z","failure_class":"transient","failure_reason":"503","payload":{}})]) + '\n', encoding="utf-8")
            out = td / "plan.json"; p = self.run_gate("plan", "--input", str(src), "--policy", str(POLICY), "--environment", "staging", "--now", "2026-09-06T12:00:00Z", "--out", str(out)); self.assertEqual(p.returncode, 2); self.assertEqual(json.loads(out.read_text())["messages"][1]["status"], "blocked")

    def test_reconcile_requires_all_receipts(self):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td); plan = {"approval_required": False, "messages": [{"message_id":"a","idempotency_key":"k-a","status":"eligible"}, {"message_id":"b","idempotency_key":"k-b","status":"eligible"}]}
            (td / "plan.json").write_text(json.dumps(plan)); (td / "receipts.jsonl").write_text(json.dumps({"message_id":"a","idempotency_key":"k-a","status":"succeeded","external_receipt":"r1"}) + "\n")
            out = td / "verify.json"; p = self.run_gate("reconcile", "--plan", str(td / "plan.json"), "--receipts", str(td / "receipts.jsonl"), "--out", str(out)); self.assertEqual(p.returncode, 2); self.assertIn("missing-receipt:b", json.loads(out.read_text())["errors"])

    def test_reconcile_verified(self):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td); plan = {"approval_required": True, "messages": [{"message_id":"a","idempotency_key":"k-a","status":"eligible"}]}
            (td / "plan.json").write_text(json.dumps(plan)); (td / "receipts.jsonl").write_text(json.dumps({"message_id":"a","idempotency_key":"k-a","status":"deduplicated","external_receipt":"r1"}) + "\n")
            out = td / "verify.json"; p = self.run_gate("reconcile", "--plan", str(td / "plan.json"), "--receipts", str(td / "receipts.jsonl"), "--approved", "--out", str(out)); self.assertEqual(p.returncode, 0, p.stderr); self.assertEqual(json.loads(out.read_text())["status"], "verified")

if __name__ == "__main__": unittest.main()
