import json, subprocess, sys, tempfile, unittest
from pathlib import Path

SCRIPT=Path(__file__).parents[1]/"scripts"/"origin_auth_guard.py"
POLICY={"trusted_origin_associations":["OWNER","MEMBER","COLLABORATOR"],"repositories":["org/repo"]}
BASE={"origin_actor":"alice","origin_association":"COLLABORATOR","source_event":"issue_comment:1","relay_actor":"agent-bot","capability":"repo_write","repository":"org/repo","ref":"main"}

def run(event):
    with tempfile.TemporaryDirectory() as d:
        e=Path(d)/"event.json"; p=Path(d)/"policy.json"
        e.write_text(json.dumps(event)); p.write_text(json.dumps(POLICY))
        cp=subprocess.run([sys.executable,str(SCRIPT),"--event",str(e),"--policy",str(p)],capture_output=True,text=True)
        return cp.returncode,json.loads(cp.stdout)

class GuardTests(unittest.TestCase):
    def test_trusted_origin_allows(self):
        rc,out=run(BASE); self.assertEqual(rc,0); self.assertEqual(out["decision"],"allow")
    def test_untrusted_origin_not_upgraded_by_bot(self):
        e=dict(BASE,origin_actor="attacker",origin_association="NONE")
        rc,out=run(e); self.assertEqual(rc,2); self.assertEqual(out["decision"],"require_approval")
    def test_wrong_repo_denies(self):
        rc,out=run(dict(BASE,repository="other/repo")); self.assertEqual(rc,2); self.assertEqual(out["decision"],"deny")
    def test_missing_provenance_fails_closed(self):
        e=dict(BASE); del e["origin_actor"]
        rc,out=run(e); self.assertEqual(rc,3); self.assertEqual(out["decision"],"error")
    def test_hash_changes_with_provenance(self):
        _,a=run(BASE); _,b=run(dict(BASE,ref="release")); self.assertNotEqual(a["evidence_hash"],b["evidence_hash"])

if __name__=="__main__": unittest.main()
