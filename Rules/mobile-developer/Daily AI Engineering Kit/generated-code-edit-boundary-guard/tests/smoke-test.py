#!/usr/bin/env python3
import json, os, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPTS=ROOT/'scripts'
POLICY=ROOT/'config'/'generated-boundary-policy.json'

def run(cmd,cwd,ok=(0,)):
    p=subprocess.run(cmd,cwd=cwd,text=True,capture_output=True)
    if p.returncode not in ok:
        raise AssertionError(f'command failed {p.returncode}: {cmd}\n{p.stdout}\n{p.stderr}')
    return p

def write(path,obj):
    Path(path).write_text(json.dumps(obj,indent=2),encoding='utf-8')

def main():
    with tempfile.TemporaryDirectory() as td:
        d=Path(td); run(['git','init'],d); run(['git','config','user.email','test@example.com'],d); run(['git','config','user.name','Test'],d)
        (d/'schema.json').write_text('{"version":1}\n',encoding='utf-8'); (d/'client.g.cs').write_text('// auto-generated\nclass C {}\n',encoding='utf-8')
        run(['git','add','.'],d); run(['git','commit','-m','base'],d)
        manifest={'task_id':'smoke','head':'HEAD','implementation_owner':'impl','items':[
            {'path':'schema.json','classification':'source','evidence':['authoritative schema']},
            {'path':'client.g.cs','classification':'generated','evidence':['auto-generated marker'],'source_path':'schema.json','generator_command':'example-generator'}]}
        mp=d/'manifest.json'; write(mp,manifest)
        run([sys.executable,str(SCRIPTS/'validate-generated-boundary.py'),'--manifest',str(mp),'--policy',str(POLICY)],d)
        (d/'schema.json').write_text('{"version":2}\n',encoding='utf-8'); (d/'client.g.cs').write_text('// auto-generated\nclass C { int X; }\n',encoding='utf-8')
        dr=d/'diff.json'; run([sys.executable,str(SCRIPTS/'inspect-generated-diff.py'),'--manifest',str(mp),'--output',str(dr)],d)
        review=d/'review.json'; verification=d/'verification.json'
        write(review,{'reviewer_id':'reviewer','decision':'verified'}); write(verification,{'build_passed':True,'tests_passed':True})
        p=run([sys.executable,str(SCRIPTS/'evaluate-generated-boundary-gate.py'),'--manifest',str(mp),'--diff-report',str(dr),'--review',str(review),'--verification',str(verification),'--policy',str(POLICY)],d)
        assert json.loads(p.stdout)['status']=='verified'
        run(['git','checkout','--','.'],d); (d/'client.g.cs').write_text('// auto-generated\nclass C { int Y; }\n',encoding='utf-8')
        p=run([sys.executable,str(SCRIPTS/'inspect-generated-diff.py'),'--manifest',str(mp),'--output',str(dr)],d,ok=(2,))
        assert json.loads(p.stdout)['status']=='blocked'
    print('smoke-test: PASS')
    return 0

if __name__=='__main__': raise SystemExit(main())
