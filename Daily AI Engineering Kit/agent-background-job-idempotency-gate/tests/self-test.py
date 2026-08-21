#!/usr/bin/env python3
import json, pathlib, subprocess, sys, tempfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
def run(*args): return subprocess.run([sys.executable,*map(str,args)],capture_output=True,text=True)
def main():
 example=ROOT/'examples'/'assessment.json'
 v=run(ROOT/'scripts'/'validate-assessment.py',example)
 if v.returncode: print(v.stderr); return 1
 with tempfile.TemporaryDirectory() as td:
  p=pathlib.Path(td); (p/'worker.cs').write_text('var key = Guid.NewGuid(); while(true) { Run(); }',encoding='utf-8')
  out=p/'scan.json'; s=run(ROOT/'scripts'/'scan-idempotency.py',p,'--output',out)
  if s.returncode!=1: print('scanner did not flag fixture'); return 1
  data=json.loads(out.read_text(encoding='utf-8'))
  names={x['pattern'] for x in data['findings']}
  if not {'random_idempotency_key','unbounded_retry'} <= names: print('expected patterns missing'); return 1
 print('self-test passed'); return 0
if __name__=='__main__': raise SystemExit(main())
