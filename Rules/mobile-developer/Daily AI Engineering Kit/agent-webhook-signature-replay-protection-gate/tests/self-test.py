#!/usr/bin/env python3
import json, pathlib, subprocess, sys, tempfile, time
ROOT=pathlib.Path(__file__).resolve().parents[1]
def run(*args): return subprocess.run([sys.executable,*map(str,args)],capture_output=True,text=True)
def main():
 v=run(ROOT/'scripts'/'validate-assessment.py',ROOT/'examples'/'assessment.json')
 if v.returncode: print(v.stderr); return 1
 with tempfile.TemporaryDirectory() as td:
  p=pathlib.Path(td); body=p/'body.json'; body.write_text('{"event":"x"}',encoding='utf-8')
  g=run(ROOT/'scripts'/'verify-signature-fixture.py','--secret','test-secret','--body-file',body,'--timestamp',str(int(time.time())))
  if g.returncode: print(g.stderr); return 1
  sig=json.loads(g.stdout)['signature']; ts=json.loads(g.stdout)['timestamp']
  ok=run(ROOT/'scripts'/'verify-signature-fixture.py','--secret','test-secret','--body-file',body,'--timestamp',str(ts),'--signature',sig)
  if ok.returncode: print(ok.stderr); return 1
  bad=run(ROOT/'scripts'/'verify-signature-fixture.py','--secret','test-secret','--body-file',body,'--timestamp',str(ts),'--signature','0'*64)
  if bad.returncode!=1: print('invalid signature was not rejected'); return 1
  src=p/'handler.cs'; src.write_text('var webhookSecret = "super-secret-value"; if (signature == expected) { }',encoding='utf-8')
  out=p/'scan.json'; s=run(ROOT/'scripts'/'scan-webhook-security.py',p,'--output',out)
  if s.returncode!=1: print('scanner did not flag fixture'); return 1
  names={x['pattern'] for x in json.loads(out.read_text(encoding='utf-8'))['findings']}
  if not {'hardcoded_webhook_secret','non_constant_compare'} <= names: print('expected scanner patterns missing'); return 1
 print('self-test passed'); return 0
if __name__=='__main__': raise SystemExit(main())
