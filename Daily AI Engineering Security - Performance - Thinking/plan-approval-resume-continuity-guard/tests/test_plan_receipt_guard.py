import hashlib
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/"scripts"/"plan_receipt_guard.py"
POLICY=ROOT/"config"/"policy.json"
NOW="2026-08-25T01:00:00Z"

class ReceiptTests(unittest.TestCase):
    def base(self, plan_bytes):
        return {
            "schema_version":1,
            "task_id":"TASK-1",
            "plan_sha256":hashlib.sha256(plan_bytes).hexdigest(),
            "workspace_revision":"rev-a",
            "approval_id":"approval-123",
            "decision":"approved",
            "approved_at":"2026-08-25T00:00:00Z",
            "expires_at":"2026-08-25T12:00:00Z",
            "approver_type":"human",
            "allowed_phases":["implementation","verification"]
        }
    def run_case(self, mutate=None, plan_after=None, workspace="rev-a", phase="implementation"):
        original=b"# Approved plan\n- change A\n"
        receipt=self.base(original)
        if mutate: mutate(receipt)
        plan_bytes=plan_after if plan_after is not None else original
        with tempfile.TemporaryDirectory() as td:
            td=Path(td); plan=td/"PLAN.md"; rec=td/"receipt.json"
            plan.write_bytes(plan_bytes); rec.write_text(json.dumps(receipt),encoding="utf-8")
            return subprocess.run([sys.executable,str(SCRIPT),"--plan",str(plan),"--receipt",str(rec),"--task-id","TASK-1","--workspace-revision",workspace,"--phase",phase,"--policy",str(POLICY),"--now",NOW],text=True,capture_output=True)
    def test_valid_receipt_passes(self):
        r=self.run_case(); self.assertEqual(r.returncode,0,r.stdout+r.stderr); self.assertIn('"status": "VALID"',r.stdout)
    def test_plan_drift_blocks(self):
        r=self.run_case(plan_after=b"# changed plan\n"); self.assertEqual(r.returncode,2); self.assertIn("PLAN_HASH_MISMATCH",r.stdout)
    def test_workspace_drift_blocks(self):
        r=self.run_case(workspace="rev-b"); self.assertEqual(r.returncode,2); self.assertIn("WORKSPACE_REVISION_MISMATCH",r.stdout)
    def test_expired_blocks(self):
        r=self.run_case(lambda x: x.update({"expires_at":"2026-08-25T00:30:00Z"})); self.assertEqual(r.returncode,2); self.assertIn("APPROVAL_EXPIRED",r.stdout)
    def test_phase_scope_blocks(self):
        r=self.run_case(phase="deployment"); self.assertEqual(r.returncode,2); self.assertIn("PHASE_NOT_APPROVED",r.stdout)
    def test_non_human_blocks(self):
        r=self.run_case(lambda x: x.update({"approver_type":"agent"})); self.assertEqual(r.returncode,2); self.assertIn("NON_HUMAN_APPROVER",r.stdout)

if __name__=="__main__": unittest.main()
