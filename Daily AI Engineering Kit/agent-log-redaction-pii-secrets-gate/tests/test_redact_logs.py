import json, subprocess, sys, tempfile, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts/redact_logs.py'; POLICY=ROOT/'config/redaction.yaml'

def run(text):
    with tempfile.TemporaryDirectory() as d:
        inp=Path(d)/'in.log'; out=Path(d)/'out.log'; rep=Path(d)/'report.json'
        inp.write_text(text,encoding='utf-8')
        p=subprocess.run([sys.executable,str(SCRIPT),'--input',str(inp),'--output',str(out),'--policy',str(POLICY),'--report',str(rep)],capture_output=True,text=True)
        return p.returncode,json.loads(p.stdout),out.read_text(encoding='utf-8'),json.loads(rep.read_text(encoding='utf-8'))

class RedactionTests(unittest.TestCase):
    def test_email_and_ip_are_redacted(self):
        code,r,out,_=run('user=person@example.invalid ip=203.0.113.10')
        self.assertEqual(code,0); self.assertNotIn('person@example.invalid',out); self.assertNotIn('203.0.113.10',out)
        self.assertEqual(r['status'],'sanitized')
    def test_bearer_blocks_automatic_handoff(self):
        code,r,out,rep=run('Authorization: Bearer syntheticTokenValue1234567890')
        self.assertEqual(code,2); self.assertEqual(r['status'],'blocked_sensitive_input'); self.assertNotIn('syntheticTokenValue',out)
        self.assertNotIn('syntheticTokenValue',json.dumps(rep))
    def test_api_key_is_redacted(self):
        code,r,out,_=run('api_key=synthetic_api_key_1234567890')
        self.assertIn(code,(0,2)); self.assertNotIn('synthetic_api_key_1234567890',out)
    def test_normal_log_passes_unchanged(self):
        text='INFO correlation_id=abc-123 status=200'
        code,r,out,_=run(text)
        self.assertEqual(code,0); self.assertEqual(out,text); self.assertEqual(r['findings_count'],0)
    def test_second_scan_has_no_findings(self):
        code,_,out,_=run('user=person@example.invalid')
        self.assertEqual(code,0)
        code2,r2,_,_=run(out)
        self.assertEqual(code2,0); self.assertEqual(r2['findings_count'],0)
    def test_private_key_redaction_preserves_line_count(self):
        text='before\n-----BEGIN PRIVATE KEY-----\nabcDEF1234567890\n-----END PRIVATE KEY-----\nafter\n'
        code,r,out,_=run(text)
        self.assertEqual(code,2); self.assertEqual(r['status'],'blocked_sensitive_input')
        self.assertEqual(out.count('\n'),text.count('\n')); self.assertNotIn('abcDEF1234567890',out)
if __name__=='__main__': unittest.main()
