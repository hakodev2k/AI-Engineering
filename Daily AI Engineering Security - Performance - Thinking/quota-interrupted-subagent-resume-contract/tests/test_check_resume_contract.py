import json, subprocess, sys, tempfile, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts'/'check_resume_contract.py'
POLICY=ROOT/'config'/'resume-policy.json'

class ResumeContractTests(unittest.TestCase):
    def run_cp(self, cp):
        with tempfile.NamedTemporaryFile('w',suffix='.json',delete=False) as f:
            json.dump(cp,f); name=f.name
        try:
            return subprocess.run([sys.executable,str(SCRIPT),'--policy',str(POLICY),'--checkpoint',name],capture_output=True,text=True)
        finally: Path(name).unlink(missing_ok=True)

    def base(self):
        return {'task_id':'t1','state':'interrupted','last_verified_phase':'investigate','resume_attempts':0,'input_fingerprint':'abc','verifier_required':True,'side_effect_ledger':[]}

    def test_valid_checkpoint_allows(self):
        r=self.run_cp(self.base()); self.assertEqual(r.returncode,0); self.assertIn('"ALLOW"',r.stdout)

    def test_unknown_non_idempotent_effect_blocks(self):
        cp=self.base(); cp['side_effect_ledger']=[{'operation_id':'deploy-1','outcome':'unknown','idempotent':False}]
        r=self.run_cp(cp); self.assertEqual(r.returncode,2); self.assertIn('unknown_non_idempotent_effect',r.stdout)

    def test_retry_budget_blocks(self):
        cp=self.base(); cp['resume_attempts']=2
        self.assertEqual(self.run_cp(cp).returncode,2)

if __name__=='__main__': unittest.main()
