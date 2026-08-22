import json, subprocess, sys, tempfile, unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "approval_arbitrator.py"

class TestApprovalArbitrator(unittest.TestCase):
    def run_case(self, state, transition):
        with tempfile.TemporaryDirectory() as d:
            s, t = Path(d)/"state.json", Path(d)/"transition.json"
            s.write_text(json.dumps(state), encoding="utf-8")
            t.write_text(json.dumps(transition), encoding="utf-8")
            return subprocess.run([sys.executable, str(SCRIPT), "validate", "--state", str(s), "--transition", str(t)], capture_output=True, text=True)

    def test_external_claim_has_bounded_lease(self):
        state={"request_id":"r1","status":"pending","risk":"medium","effective_reviewer":"external","max_external_lease_seconds":300}
        tr={"request_id":"r1","status":"claimed","owner":"external","now_epoch":1000,"lease_expires_epoch":1100}
        self.assertEqual(self.run_case(state,tr).returncode,0)

    def test_external_cannot_steal_native_reviewer(self):
        state={"request_id":"r1","status":"pending","risk":"medium","effective_reviewer":"user"}
        tr={"request_id":"r1","status":"claimed","owner":"external","now_epoch":1000,"lease_expires_epoch":1100}
        self.assertEqual(self.run_case(state,tr).returncode,2)

    def test_unknown_reviewer_high_risk_fails_closed(self):
        state={"request_id":"r1","status":"pending","risk":"high","effective_reviewer":"unknown"}
        tr={"request_id":"r1","status":"claimed","owner":"external","now_epoch":1000,"lease_expires_epoch":1100}
        self.assertEqual(self.run_case(state,tr).returncode,2)

    def test_terminal_request_rejects_late_decision(self):
        state={"request_id":"r1","status":"allow","risk":"low","effective_reviewer":"user"}
        tr={"request_id":"r1","status":"deny","owner":"user"}
        self.assertEqual(self.run_case(state,tr).returncode,2)

if __name__ == "__main__": unittest.main()
