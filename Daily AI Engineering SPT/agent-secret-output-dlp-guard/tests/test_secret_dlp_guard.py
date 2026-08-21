#!/usr/bin/env python3
from __future__ import annotations
import importlib.util, json, os, tempfile, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SPEC=importlib.util.spec_from_file_location("guard",ROOT/"scripts"/"secret_dlp_guard.py")
GUARD=importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(GUARD)
POLICY=json.loads((ROOT/"config"/"policy.json").read_text(encoding="utf-8"))

class GuardTests(unittest.TestCase):
    def test_known_env_secret_is_redacted(self):
        old=os.environ.get("TEST_API_KEY")
        os.environ["TEST_API_KEY"]="canary-super-secret-123456"
        try:
            clean,findings,blocked=GUARD.sanitize_text("value=canary-super-secret-123456",POLICY)
            self.assertNotIn("canary-super-secret-123456",clean)
            self.assertIn("<REDACTED:known-secret>",clean)
            self.assertTrue(findings); self.assertFalse(blocked)
        finally:
            if old is None: os.environ.pop("TEST_API_KEY",None)
            else: os.environ["TEST_API_KEY"]=old

    def test_provider_pattern_redacts(self):
        secret="ghp_abcdefghijklmnopqrstuvwxyz123456"
        clean,findings,blocked=GUARD.sanitize_text("token="+secret,POLICY)
        self.assertNotIn(secret,clean); self.assertTrue(findings); self.assertFalse(blocked)

    def test_sensitive_assignment_redacts_unknown_format(self):
        value="weirdCredentialValue987654321"
        clean,findings,_=GUARD.sanitize_text("CLIENT_SECRET="+value,POLICY)
        self.assertNotIn(value,clean); self.assertTrue(findings)

    def test_private_key_blocks(self):
        text="-----BEGIN PRIVATE KEY-----\nABCDEF\n-----END PRIVATE KEY-----"
        clean,findings,blocked=GUARD.sanitize_text(text,POLICY)
        self.assertTrue(blocked); self.assertTrue(findings)

    def test_benign_text_preserved(self):
        text="build succeeded in 1.2s; 18 tests passed"
        clean,findings,blocked=GUARD.sanitize_text(text,POLICY)
        self.assertEqual(text,clean); self.assertEqual([],findings); self.assertFalse(blocked)

    def test_audit_finding_has_hash_not_plaintext(self):
        value="ghp_abcdefghijklmnopqrstuvwxyz123456"
        _,findings,_=GUARD.sanitize_text(value,POLICY)
        encoded=json.dumps(findings)
        self.assertNotIn(value,encoded); self.assertIn("sha256_prefix",encoded)

    def test_precheck_env_dump_denies(self):
        class A: tool="bash"; target="echo ok; env"
        import io, contextlib
        buf=io.StringIO()
        with contextlib.redirect_stdout(buf): rc=GUARD.precheck(A,POLICY)
        self.assertEqual(3,rc); self.assertIn('"decision": "deny"',buf.getvalue())

    def test_precheck_benign_allows(self):
        class A: tool="bash"; target="dotnet test --no-restore"
        import io, contextlib
        buf=io.StringIO()
        with contextlib.redirect_stdout(buf): rc=GUARD.precheck(A,POLICY)
        self.assertEqual(0,rc)

if __name__=="__main__": unittest.main(verbosity=2)