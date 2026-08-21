#!/usr/bin/env python3
import json, subprocess, tempfile, unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

SCRIPT=Path(__file__).resolve().parents[1]/"scripts"/"check_action_gates.py"

def run(reg,action,evidence):
    with tempfile.TemporaryDirectory() as d:
        paths=[]
        for name,obj in [("r",reg),("a",action),("e",evidence)]:
            p=Path(d)/(name+".json"); p.write_text(json.dumps(obj)); paths.append(p)
        p=subprocess.run(["python3",str(SCRIPT),"--registry",str(paths[0]),"--action",str(paths[1]),"--evidence",str(paths[2])],capture_output=True,text=True)
        return p.returncode,json.loads(p.stdout)

def registry(mode="block"):
    return {"gates":[{"id":"build","actions":["benchmark"],"required_evidence":[{"key":"build_passed","equals":True,"max_age_seconds":300,"same_epoch":True}],"on_failure":mode}]}

def action(): return {"type":"benchmark","epoch":"e1"}

def evidence(value=True,age=10,epoch="e1"):
    return {"records":{"build_passed":{"value":value,"observed_at":(datetime.now(timezone.utc)-timedelta(seconds=age)).isoformat(),"epoch":epoch}}}

class GateCases(unittest.TestCase):
    def test_fresh_allows(self):
        code,out=run(registry(),action(),evidence()); self.assertEqual(code,0); self.assertEqual(out["decision"],"allow")
    def test_missing_blocks(self):
        code,out=run(registry(),action(),{"records":{}}); self.assertEqual(code,2); self.assertEqual(out["decision"],"block")
    def test_stale_blocks(self):
        code,out=run(registry(),action(),evidence(age=600)); self.assertEqual(code,2); self.assertEqual(out["problems"][0]["reason"],"stale")
    def test_epoch_mismatch_blocks(self):
        code,out=run(registry(),action(),evidence(epoch="old")); self.assertEqual(code,2); self.assertEqual(out["problems"][0]["reason"],"epoch-mismatch")
    def test_review_gate_requests_review(self):
        code,out=run(registry("review"),action(),{"records":{}}); self.assertEqual(code,3); self.assertEqual(out["decision"],"review")
    def test_unmatched_action_allows(self):
        a={"type":"read-file","epoch":"e1"}; code,out=run(registry(),a,{"records":{}}); self.assertEqual(code,0); self.assertEqual(out["matched_gates"],[])

if __name__=="__main__": unittest.main()
