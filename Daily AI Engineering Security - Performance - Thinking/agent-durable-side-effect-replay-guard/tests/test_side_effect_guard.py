import json
import os
import sqlite3
import subprocess
import sys
import tempfile
import time
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "side_effect_guard.py"


def run_guard(db, *args):
    p = subprocess.run(
        [sys.executable, str(SCRIPT), "--db", str(db), *args],
        text=True,
        capture_output=True,
    )
    data = json.loads(p.stdout.strip()) if p.stdout.strip() else {}
    return p.returncode, data


class SideEffectGuardTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.db = Path(self.tmp.name) / "ledger.sqlite3"
        self.semantic = '{"customer_id":"c-1","invoice_id":"i-9"}'

    def tearDown(self):
        self.tmp.cleanup()

    def claim(self, owner="worker-a", ttl=300):
        return run_guard(
            self.db,
            "claim",
            "--workflow-id", "wf-1",
            "--effect-type", "send_invoice",
            "--owner", owner,
            "--semantic-json", self.semantic,
            "--ttl", str(ttl),
        )

    def test_first_claim_executes_second_waits(self):
        rc1, a = self.claim("a")
        rc2, b = self.claim("b")
        self.assertEqual(rc1, 0)
        self.assertEqual(a["decision"], "execute")
        self.assertEqual(rc2, 2)
        self.assertEqual(b["decision"], "wait")
        self.assertEqual(a["op_key"], b["op_key"])

    def test_completed_replay_reuses_without_new_execution(self):
        rc, a = self.claim("a")
        self.assertEqual(rc, 0)
        rc2, done = run_guard(self.db, "complete", "--op-key", a["op_key"], "--owner", "a", "--result-ref", "msg-123")
        self.assertEqual(rc2, 0)
        self.assertEqual(done["decision"], "completed")
        rc3, replay = self.claim("new-worker")
        self.assertEqual(rc3, 0)
        self.assertEqual(replay["decision"], "reuse")
        self.assertEqual(replay["result_ref"], "msg-123")

    def test_wrong_owner_cannot_complete(self):
        _, a = self.claim("a")
        rc, data = run_guard(self.db, "complete", "--op-key", a["op_key"], "--owner", "b")
        self.assertEqual(rc, 2)
        self.assertEqual(data["error"], "not_active_owner")

    def test_expired_claim_becomes_uncertain_and_blocks_retry(self):
        _, a = self.claim("a", ttl=300)
        db = sqlite3.connect(self.db)
        db.execute("UPDATE effects SET claimed_at=? WHERE op_key=?", (int(time.time()) - 1000, a["op_key"]))
        db.commit()
        db.close()
        rc, replay = self.claim("b", ttl=1)
        self.assertEqual(rc, 2)
        self.assertEqual(replay["decision"], "reconcile")
        rc2, status = run_guard(self.db, "status", "--op-key", a["op_key"])
        self.assertEqual(rc2, 0)
        self.assertEqual(status["state"], "uncertain")

    def test_uncertain_requires_explicit_resolution_before_retry(self):
        _, a = self.claim("a")
        db = sqlite3.connect(self.db)
        db.execute("UPDATE effects SET state='uncertain' WHERE op_key=?", (a["op_key"],))
        db.commit()
        db.close()
        rc, blocked = self.claim("b")
        self.assertEqual(rc, 2)
        self.assertEqual(blocked["decision"], "reconcile")
        rc2, resolved = run_guard(self.db, "resolve", "--op-key", a["op_key"], "--resolution", "retry", "--note", "authoritative absence")
        self.assertEqual(rc2, 0)
        self.assertEqual(resolved["decision"], "retry_released")
        rc3, fresh = self.claim("b")
        self.assertEqual(rc3, 0)
        self.assertEqual(fresh["decision"], "execute")

    def test_semantic_json_order_does_not_change_key(self):
        rc1, a = run_guard(self.db, "claim", "--workflow-id", "wf-order", "--effect-type", "x", "--owner", "a", "--semantic-json", '{"a":1,"b":2}')
        self.assertEqual(rc1, 0)
        rc2, b = run_guard(self.db, "claim", "--workflow-id", "wf-order", "--effect-type", "x", "--owner", "b", "--semantic-json", '{"b":2,"a":1}')
        self.assertEqual(rc2, 2)
        self.assertEqual(a["op_key"], b["op_key"])


if __name__ == "__main__":
    unittest.main()
