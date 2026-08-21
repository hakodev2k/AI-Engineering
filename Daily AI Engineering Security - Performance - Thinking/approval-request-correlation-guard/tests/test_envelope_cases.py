#!/usr/bin/env python3
import json, subprocess, tempfile, unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

SCRIPT=Path(__file__).resolve().parents[1]/"scripts"/"verify_approval_envelope.py"

def base():
    now=datetime.now(timezone.utc)
    return {
      "session_id":"s1","turn_id":"t1","request_id":"r1","tool_call_id":"c1",
      "action_digest":"sha256:action","policy_digest":"sha256:policy","nonce":"n1",
      "created_at":(now-timedelta(minutes=1)).isoformat(),
      "expires_at":(now+timedelta(minutes=5)).isoformat(),"state":"pending","consumed":False
    }

def run(req,resp):
    with tempfile.TemporaryDirectory() as d:
        a,b=Path(d)/"q.json",Path(d)/"r.json"
        a.write_text(json.dumps(req)); b.write_text(json.dumps(resp))
        p=subprocess.run(["python3",str(SCRIPT),"--request",str(a),"--response",str(b)],capture_output=True,text=True)
        return p.returncode,json.loads(p.stdout)

class Cases(unittest.TestCase):
    def test_exact_accepts(self):
        q=base(); code,out=run(q,dict(q)); self.assertEqual(code,0); self.assertEqual(out["decision"],"accept")
    def test_cross_session_rejects(self):
        q=base(); r=dict(q); r["session_id"]="s2"; code,out=run(q,r); self.assertNotEqual(code,0); self.assertEqual(out["decision"],"reject-mismatch")
    def test_changed_action_rejects(self):
        q=base(); r=dict(q); r["action_digest"]="sha256:other"; code,_=run(q,r); self.assertNotEqual(code,0)
    def test_cancelled_rejects(self):
        q=base(); q["state"]="cancelled"; code,out=run(q,dict(q)); self.assertEqual(out["decision"],"reject-revoked"); self.assertNotEqual(code,0)
    def test_duplicate_rejects(self):
        q=base(); q["consumed"]=True; code,out=run(q,dict(q)); self.assertEqual(out["decision"],"reject-duplicate"); self.assertNotEqual(code,0)
    def test_expired_rejects(self):
        q=base(); q["expires_at"]=(datetime.now(timezone.utc)-timedelta(seconds=1)).isoformat(); code,out=run(q,dict(q)); self.assertEqual(out["decision"],"reject-stale"); self.assertNotEqual(code,0)

if __name__=="__main__": unittest.main()
