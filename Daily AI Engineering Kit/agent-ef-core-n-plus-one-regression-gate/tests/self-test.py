#!/usr/bin/env python3
import json, pathlib, subprocess, sys, tempfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
def run(*args): return subprocess.run([sys.executable,*map(str,args)],capture_output=True,text=True)
def main():
 v=run(ROOT/'scripts'/'validate-assessment.py', ROOT/'examples'/'assessment.json')
 if v.returncode: print(v.stderr); return 1
 with tempfile.TemporaryDirectory() as td:
  p=pathlib.Path(td)
  (p/'Service.cs').write_text('foreach (var x in items) { var y = await db.Users.FindAsync(x.UserId); }',encoding='utf-8')
  out=p/'scan.json'; s=run(ROOT/'scripts'/'scan-n-plus-one.py',p,'--output',out)
  if s.returncode!=1: print('scanner did not flag fixture'); return 1
  data=json.loads(out.read_text(encoding='utf-8'))
  if not data['findings']: print('expected finding missing'); return 1
 print('self-test passed'); return 0
if __name__=='__main__': raise SystemExit(main())
