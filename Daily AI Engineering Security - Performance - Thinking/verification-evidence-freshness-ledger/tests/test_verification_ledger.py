import datetime as dt
import unittest
from scripts.verification_ledger import evaluate, evidence_key

NOW = dt.datetime(2026, 8, 26, 16, 0, tzinfo=dt.timezone.utc)


def rec(rev="abc1234", status="passed", ts="2026-08-26T15:30:00Z", eid="e1", cmd="pytest"):
    return {"evidence_id": eid, "revision": rev, "command": cmd, "status": status, "timestamp": ts}


class LedgerTests(unittest.TestCase):
    def test_fresh_exact_revision_allows(self):
        result = evaluate([rec()], "abc1234", 3600, NOW)
        self.assertTrue(result["ok"])
        self.assertEqual(result["decision"], "allow_completion")
        self.assertEqual(result["evidence_key"], evidence_key(rec()))

    def test_old_revision_rejected(self):
        result = evaluate([rec(rev="old9999")], "abc1234", 3600, NOW)
        self.assertFalse(result["ok"])
        self.assertEqual(result["reason"], "no_evidence_for_current_revision")

    def test_stale_passing_rejected(self):
        result = evaluate([rec(ts="2026-08-26T13:00:00Z")], "abc1234", 3600, NOW)
        self.assertFalse(result["ok"])
        self.assertEqual(result["reason"], "passing_evidence_stale")

    def test_latest_failure_supersedes_older_pass(self):
        rows = [
            rec(ts="2026-08-26T15:00:00Z", eid="pass"),
            rec(status="failed", ts="2026-08-26T15:40:00Z", eid="fail"),
        ]
        result = evaluate(rows, "abc1234", 3600, NOW)
        self.assertFalse(result["ok"])
        self.assertEqual(result["evidence_id"], "fail")

    def test_future_timestamp_rejected(self):
        result = evaluate([rec(ts="2026-08-26T17:00:00Z")], "abc1234", 3600, NOW)
        self.assertFalse(result["ok"])
        self.assertEqual(result["reason"], "evidence_timestamp_in_future")


if __name__ == "__main__":
    unittest.main()
