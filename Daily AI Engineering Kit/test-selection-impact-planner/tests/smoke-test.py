#!/usr/bin/env python3
import json, os, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PY=sys.executable

def run(args, cwd=None):
    return subprocess.run(args,cwd=cwd,text=True,capture_output=True)

def write(path,obj):
    Path(path).write_text(json.dumps(obj,indent=2),encoding='utf-8')

def main():
    plan=json.loads((ROOT/'templates/test-plan.example.json').read_text())
    execution=json.loads((ROOT/'examples/test-execution.json').read_text())
    review=json.loads((ROOT/'examples/coverage-review.json').read_text())
    policy=ROOT/'config/test-selection-policy.json'
    with tempfile.TemporaryDirectory() as td:
        p=Path(td)
        write(p/'plan.json',plan); write(p/'execution.json',execution); write(p/'review.json',review)
        v=run([PY,str(ROOT/'scripts/validate-test-plan.py'),'--plan',str(p/'plan.json'),'--policy',str(policy)])
        assert v.returncode==0, v.stdout+v.stderr
        g=run([PY,str(ROOT/'scripts/evaluate-test-gate.py'),'--plan',str(p/'plan.json'),'--execution',str(p/'execution.json'),'--review',str(p/'review.json'),'--policy',str(policy)])
        assert g.returncode==0 and json.loads(g.stdout)['status']=='verified', g.stdout+g.stderr
        broaden=dict(review); broaden['status']='broaden-required'; broaden['findings']=['shared dependency confidence insufficient']; write(p/'broaden.json',broaden)
        b=run([PY,str(ROOT/'scripts/evaluate-test-gate.py'),'--plan',str(p/'plan.json'),'--execution',str(p/'execution.json'),'--review',str(p/'broaden.json'),'--policy',str(policy)])
        assert b.returncode==10 and json.loads(b.stdout)['status']=='broaden-required', b.stdout+b.stderr
        bad=json.loads(json.dumps(execution)); bad['runs'][1]['executed']=0; write(p/'bad.json',bad)
        x=run([PY,str(ROOT/'scripts/evaluate-test-gate.py'),'--plan',str(p/'plan.json'),'--execution',str(p/'bad.json'),'--review',str(p/'review.json'),'--policy',str(policy)])
        assert x.returncode==20 and json.loads(x.stdout)['status']=='blocked', x.stdout+x.stderr
    print('smoke-test: PASS')
    return 0
if __name__=='__main__': sys.exit(main())