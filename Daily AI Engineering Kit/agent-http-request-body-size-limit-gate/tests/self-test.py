#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCAN=ROOT/'scripts'/'scan-body-size-risk.py'
VALIDATE=ROOT/'scripts'/'validate-assessment.py'
EXAMPLE=ROOT/'examples'/'assessment.example.json'

def run(cmd):
    return subprocess.run([sys.executable,*map(str,cmd)],capture_output=True,text=True)

def main():
    with tempfile.TemporaryDirectory() as td:
        repo=Path(td)
        (repo/'unsafe.cs').write_text('app.Use(async (ctx,next) => { var ms = new MemoryStream(); await ctx.Request.Body.CopyToAsync(ms); });\n',encoding='utf-8')
        out=repo/'scan.json'
        r=run([SCAN,repo,'--output',out])
        assert r.returncode==1, (r.returncode,r.stdout,r.stderr)
        data=json.loads(out.read_text(encoding='utf-8'))
        assert data['finding_count']>=1
    r=run([VALIDATE,EXAMPLE])
    assert r.returncode==0, (r.stdout,r.stderr)
    broken=json.loads(EXAMPLE.read_text(encoding='utf-8'))
    broken['verification']['oversized_request_rejected']=False
    with tempfile.NamedTemporaryFile('w',suffix='.json',delete=False,encoding='utf-8') as f:
        json.dump(broken,f); name=f.name
    try:
        r=run([VALIDATE,name])
        assert r.returncode==1
    finally:
        Path(name).unlink(missing_ok=True)
    print('self-test passed')
    return 0

if __name__=='__main__': raise SystemExit(main())
