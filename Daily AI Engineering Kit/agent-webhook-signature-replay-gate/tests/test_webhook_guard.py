import importlib.util, json, tempfile, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SPEC=importlib.util.spec_from_file_location("guard", ROOT/"scripts"/"webhook_guard.py")
guard=importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(guard)
POLICY=json.loads((ROOT/"config"/"webhook-policy.json").read_text())

class GuardTests(unittest.TestCase):
    def setUp(self):
        self.secret="s3cr3t"; self.body='{"id":"1"}'; self.ts=1700000000
        self.sig=guard.compute_signature(self.secret,self.ts,self.body,POLICY)

    def test_valid(self):
        ok,reason=guard.verify(self.secret,self.ts,self.ts+10,self.body,self.sig,POLICY)
        self.assertTrue(ok); self.assertEqual(reason,"verified")

    def test_tampered_body_fails(self):
        ok,reason=guard.verify(self.secret,self.ts,self.ts,self.body+" ",self.sig,POLICY)
        self.assertFalse(ok); self.assertEqual(reason,"invalid-signature")

    def test_stale_timestamp_fails(self):
        ok,reason=guard.verify(self.secret,self.ts,self.ts+301,self.body,self.sig,POLICY)
        self.assertFalse(ok); self.assertEqual(reason,"stale-timestamp")

    def test_malformed_signature_fails(self):
        ok,reason=guard.verify(self.secret,self.ts,self.ts,self.body,"not-a-signature",POLICY)
        self.assertFalse(ok); self.assertEqual(reason,"invalid-signature")

    def test_signature_depends_on_raw_bytes(self):
        body2='{ "id": "1" }'
        self.assertNotEqual(self.sig, guard.compute_signature(self.secret,self.ts,body2,POLICY))

if __name__ == "__main__": unittest.main()
