import json, subprocess, sys, tempfile, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/"scripts"/"validate_partial_progress.py"
POLICY=ROOT/"config"/"policy.json"

BASE={"child_id":"a1","cause":"watchdog_timeout","human_initiated":False,"started_at":"2026-08-22T01:00:00+07:00","ended_at":"2026-08-22T01:10:00+07:00","tool_call_count":3,"last_action":"run tests","known_side_effects":[],"incomplete_step":"await final model response","evidence_pointer":"transcripts/a1.jsonl","recovery_recommendation":"safe_retry"}

class ContractTests(unittest.TestCase):
    def run_case(self,obj):
        f=tempfile.NamedTemporaryFile("w",encoding="utf-8",delete=False); json.dump(obj,f); f.close()
        cp=subprocess.run([sys.executable,str(SCRIPT),f.name,"--policy",str(POLICY)],text=True,capture_output=True)
        return cp.returncode,json.loads(cp.stdout or cp.stderr)

    def test_valid_watchdog_envelope(self):
        code,r=self.run_case(dict(BASE)); self.assertEqual(code,0); self.assertEqual(r["decision"],"allow")

    def test_unproven_user_cancel_blocks(self):
        x=dict(BASE); x["cause"]="user_cancelled"; x["human_initiated"]=False
        code,r=self.run_case(x); self.assertEqual(code,4); self.assertTrue(any(f["kind"]=="unproven_user_cancellation" for f in r["findings"]))

    def test_side_effect_requires_verify_first(self):
        x=dict(BASE); x["known_side_effects"]=[{"type":"file_write","resource":"src/a.cs"}]; x["recovery_recommendation"]="safe_retry"
        code,r=self.run_case(x); self.assertEqual(code,4); self.assertTrue(any(f["kind"]=="unsafe_retry_recommendation" for f in r["findings"]))

if __name__=="__main__": unittest.main()
