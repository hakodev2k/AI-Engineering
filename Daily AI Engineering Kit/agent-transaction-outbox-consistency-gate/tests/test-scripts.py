#!/usr/bin/env python3
import json, pathlib, subprocess, sys, tempfile, unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
SCAN=ROOT/'scripts'/'scan-outbox.py'; VERIFY=ROOT/'scripts'/'verify-evidence.py'
class GateScriptsTest(unittest.TestCase):
    def test_verified_example_contract(self):
        p=subprocess.run([sys.executable,str(VERIFY),str(ROOT/'examples'/'outbox-evidence.json')],capture_output=True,text=True)
        self.assertEqual(p.returncode,0,p.stderr)
    def test_verified_requires_all_checks(self):
        with tempfile.TemporaryDirectory() as d:
            f=pathlib.Path(d)/'e.json'; f.write_text(json.dumps({'status':'verified','findings':[],'verification':{'atomicity':True,'publisher_safety':False,'consumer_idempotency':True,'retry_bounds':True}}))
            p=subprocess.run([sys.executable,str(VERIFY),str(f)],capture_output=True,text=True)
            self.assertEqual(p.returncode,1)
    def test_scanner_flags_publish_and_unbounded_retry(self):
        with tempfile.TemporaryDirectory() as d:
            root=pathlib.Path(d); (root/'Worker.cs').write_text('while (true) { await bus.PublishAsync(evt); }',encoding='utf-8')
            out=root/'evidence.json'; p=subprocess.run([sys.executable,str(SCAN),str(root),'--output',str(out)],capture_output=True,text=True)
            self.assertEqual(p.returncode,1); data=json.loads(out.read_text()); ids=' '.join(x['id'] for x in data['findings']); self.assertIn('publish-before-commit',ids); self.assertIn('unbounded-retry',ids)
if __name__=='__main__': unittest.main()
