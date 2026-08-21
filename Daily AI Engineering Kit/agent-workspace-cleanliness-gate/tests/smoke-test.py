#!/usr/bin/env python3
import json, os, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPTS=ROOT/'scripts'
POLICY=ROOT/'config'/'workspace-policy.json'

def run(cmd,cwd=None,code=0):
    p=subprocess.run(cmd,cwd=cwd,text=True,capture_output=True)
    if p.returncode!=code:
        raise AssertionError(f"expected {code}, got {p.returncode}\ncmd={cmd}\nout={p.stdout}\nerr={p.stderr}")
    return p

def load(p): return json.loads(Path(p).read_text())

with tempfile.TemporaryDirectory() as td:
    repo=Path(td)/'repo'; repo.mkdir()
    run(['git','init','-q'],repo); run(['git','config','user.email','smoke@example.invalid'],repo); run(['git','config','user.name','Smoke'],repo)
    (repo/'owned').mkdir(); (repo/'other').mkdir()
    (repo/'owned'/'a.txt').write_text('base\n'); (repo/'other'/'pre.txt').write_text('base\n')
    run(['git','add','.'],repo); run(['git','commit','-qm','base'],repo)
    (repo/'other'/'pre.txt').write_text('preexisting\n')
    baseline=Path(td)/'baseline.json'; current=Path(td)/'current.json'; manifest=Path(td)/'manifest.json'; diff=Path(td)/'diff.json'; gate=Path(td)/'gate.json'
    run([sys.executable,str(SCRIPTS/'capture-workspace.py'),'--repo',str(repo),'--output',str(baseline)])
    b=load(baseline)
    manifest.write_text(json.dumps({'version':'1.0.0','task_id':'smoke','implementation_owner':'impl','baseline_fingerprint':b['status_fingerprint'],'baseline_head':b['head'],'allowed_paths':['owned/**'],'forbidden_paths':['other/**'],'approval_actions':[]},indent=2))
    (repo/'owned'/'a.txt').write_text('agent\n')
    run([sys.executable,str(SCRIPTS/'capture-workspace.py'),'--repo',str(repo),'--output',str(current)])
    run([sys.executable,str(SCRIPTS/'derive-owned-diff.py'),'--baseline',str(baseline),'--current',str(current),'--manifest',str(manifest),'--output',str(diff)])
    d=load(diff)
    assert d['owned_paths']==['owned/a.txt'] and not d['unowned_paths'] and not d['preexisting_touched_paths']
    run([sys.executable,str(SCRIPTS/'evaluate-workspace-gate.py'),'--diff',str(diff),'--manifest',str(manifest),'--policy',str(POLICY),'--output',str(gate)])
    assert load(gate)['status']=='verified'
    final=Path(td)/'final.json'; finalgate=Path(td)/'final-gate.json'
    run([sys.executable,str(SCRIPTS/'capture-workspace.py'),'--repo',str(repo),'--output',str(final)])
    run([sys.executable,str(SCRIPTS/'evaluate-final-gate.py'),'--gate',str(gate),'--current',str(final),'--manifest',str(manifest),'--output',str(finalgate)])
    assert load(finalgate)['status']=='verified'
    (repo/'other'/'pre.txt').write_text('agent-overwrite\n')
    badcurrent=Path(td)/'badcurrent.json'; baddiff=Path(td)/'baddiff.json'; badgate=Path(td)/'badgate.json'
    run([sys.executable,str(SCRIPTS/'capture-workspace.py'),'--repo',str(repo),'--output',str(badcurrent)])
    run([sys.executable,str(SCRIPTS/'derive-owned-diff.py'),'--baseline',str(baseline),'--current',str(badcurrent),'--manifest',str(manifest),'--output',str(baddiff)])
    bd=load(baddiff); assert 'other/pre.txt' in bd['unowned_paths'] and 'other/pre.txt' in bd['preexisting_touched_paths']
    run([sys.executable,str(SCRIPTS/'evaluate-workspace-gate.py'),'--diff',str(baddiff),'--manifest',str(manifest),'--policy',str(POLICY),'--output',str(badgate)],code=5)
    assert load(badgate)['status']=='blocked'
print('smoke-test: PASS')
