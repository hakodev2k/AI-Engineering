from __future__ import annotations
import importlib.util, unittest
from datetime import datetime, timezone
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SPEC=importlib.util.spec_from_file_location("gate",ROOT/"scripts/flaky_test_gate.py")
assert SPEC and SPEC.loader
G=importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(G)
POLICY={"minimum_observations":6,"minimum_passes":2,"minimum_failures":2,"minimum_failure_rate":0.1,"maximum_failure_rate":0.9,"maximum_quarantine_days":14}
NOW=datetime(2026,9,6,tzinfo=timezone.utc)

def obs(statuses):
    return {"observations":[{"test":"t","status":s,"run_id":str(i+1),"attempt":1} for i,s in enumerate(statuses)]}

class Tests(unittest.TestCase):
    def test_candidate_requires_passes_and_failures(self):
        r=G.evaluate(obs(["passed","failed","passed","failed","passed","passed"]),{"entries":[]},POLICY,NOW)
        self.assertTrue(r["tests"][0]["flaky_candidate"])
        self.assertEqual("pass",r["status"])
    def test_deterministic_failure_not_candidate(self):
        r=G.evaluate(obs(["failed"]*6),{"entries":[]},POLICY,NOW)
        self.assertFalse(r["tests"][0]["flaky_candidate"])
    def test_quarantine_without_flaky_evidence_blocks(self):
        q={"entries":[{"test":"t","owner":"x","issue":"I-1","reason":"x","approved_by":"y","created_at":"2026-09-01T00:00:00Z","expires_at":"2026-09-10T00:00:00Z"}]}
        r=G.evaluate(obs(["passed"]*6),q,POLICY,NOW)
        self.assertEqual("fail",r["status"])
    def test_expired_quarantine_blocks(self):
        q={"entries":[{"test":"t","owner":"x","issue":"I-1","reason":"x","approved_by":"y","created_at":"2026-08-01T00:00:00Z","expires_at":"2026-08-10T00:00:00Z"}]}
        r=G.evaluate(obs(["passed","failed","passed","failed","passed","passed"]),q,POLICY,NOW)
        self.assertEqual("fail",r["status"])
        self.assertTrue(any(f["kind"]=="expired_quarantine" for f in r["findings"]))
    def test_duplicate_execution_rejected(self):
        h={"observations":[{"test":"t","status":"passed","run_id":"1","attempt":1},{"test":"t","status":"failed","run_id":"1","attempt":1}]}
        with self.assertRaises(ValueError): G.summarize(h,POLICY)

if __name__=="__main__": unittest.main()
