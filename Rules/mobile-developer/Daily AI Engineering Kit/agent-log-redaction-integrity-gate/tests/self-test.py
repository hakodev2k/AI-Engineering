#!/usr/bin/env python3
import json, pathlib, subprocess, sys, tempfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
def run(*args): return subprocess.run([sys.executable,*map(str,args)],capture_output=True,text=True)
def main():
 v=run(ROOT/'scripts'/'validate-assessment.py',ROOT/'examples'/'assessment.json')
 if v.returncode: print(v.stderr); return 1
 with tempfile.TemporaryDirectory() as td:
  p=pathlib.Path(td)
  src=p/'logger.cs'; src.write_text('logger.LogInformation("Authorization {Authorization} body {Body}", auth, body);',encoding='utf-8')
  out=p/'scan.json'; s=run(ROOT/'scripts'/'scan-logging-risks.py',p,'--output',out)
  if s.returncode!=1: print('scanner did not flag risky fixture'); return 1
  fixture=p/'fixture.json'; fixture.write_text(json.dumps({'authorization':'Bearer SENTINEL_SECRET','email':'person@example.invalid','correlation_id':'corr-42'}),encoding='utf-8')
  red=p/'redacted.json'; r=run(ROOT/'scripts'/'redact-json.py',fixture,'--policy',ROOT/'config'/'redaction-policy.json','--output',red)
  if r.returncode: print(r.stderr); return 1
  d=json.loads(red.read_text(encoding='utf-8'))
  if d['authorization']!='[REDACTED]' or d['email']!='[REDACTED]' or d['correlation_id']!='corr-42': print('redaction/correlation assertion failed'); return 1
 print('self-test passed'); return 0
if __name__=='__main__': raise SystemExit(main())
