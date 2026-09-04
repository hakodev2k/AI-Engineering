#!/usr/bin/env python3
import json,subprocess,tempfile,unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/"scripts"/"validate-findings.py"
POLICY=ROOT/"config"/"triage-policy.json"

class ValidateFindingsTests(unittest.TestCase):
    def run_case(self,record):
        with tempfile.NamedTemporaryFile("w",suffix=".json",delete=False) as f:
            json.dump(record,f); path=f.name
        return subprocess.run(["python3",str(SCRIPT),"--input",path,"--policy",str(POLICY)],capture_output=True,text=True)

    def test_verified_blocker_passes(self):
        r={"id":"A","title":"x","severity":"high","status":"confirmed","confidence":0.9,"location":{"path":"a.py","line":1},"claim":"x","evidence":[{"type":"test","description":"reproduced","command":"pytest -q","artifact":None,"exit_code":1}],"verification":{"independent":True,"result":"verified","notes":"rerun"}}
        self.assertEqual(self.run_case(r).returncode,0)

    def test_unverified_blocker_fails(self):
        r={"id":"B","title":"x","severity":"critical","status":"confirmed","confidence":0.95,"location":{"path":"a.py","line":1},"claim":"x","evidence":[{"type":"test","description":"reproduced","command":None,"artifact":None,"exit_code":1}],"verification":{"independent":False,"result":"failed","notes":"not verified"}}
        self.assertEqual(self.run_case(r).returncode,2)

    def test_rejected_finding_with_repository_proof_passes(self):
        r={"id":"C","title":"x","severity":"medium","status":"rejected","confidence":0.9,"location":{"path":"a.py","line":1},"claim":"x","evidence":[{"type":"repository-proof","description":"contradicted","command":None,"artifact":"a.py","exit_code":None}],"verification":{"independent":True,"result":"verified","notes":"checked"}}
        self.assertEqual(self.run_case(r).returncode,0)

if __name__=="__main__": unittest.main()
