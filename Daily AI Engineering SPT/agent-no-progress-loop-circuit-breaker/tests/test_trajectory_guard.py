#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).parents[1]
SCRIPT=ROOT/'scripts'/'trajectory_guard.py'
CFG=ROOT/'config'/'policy.json'

def run(events):
    with tempfile.NamedTemporaryFile('w', delete=False, suffix='.jsonl', encoding='utf-8') as f:
        for e in events: f.write(json.dumps(e)+'\n')
        name=f.name
    p=subprocess.run([sys.executable,str(SCRIPT),name,'--config',str(CFG),'--json'],capture_output=True,text=True)
    return p.returncode,json.loads(p.stdout)

def main():
    productive=[]
    for i in range(6):
        productive += [
            {'type':'action','tool':'Read','args':{'file':f'src/{i}.py'}},
            {'type':'result','output':f'content-{i}'},
            {'type':'progress','marker':f'new_evidence:{i}'},
            {'type':'turn'}]
    code,r=run(productive)
    assert code==0 and r['status']=='healthy', (code,r)

    looping=[]
    for i in range(8):
        looping += [
            {'type':'action','tool':'Read','args':{'file':'src/core.py','offset':0,'timestamp':i}},
            {'type':'result','output':'same content'},
            {'type':'turn'}]
    code,r=run(looping)
    assert code==3 and r['status']=='stop', (code,r)
    assert 'action_repetition' in r['reasons'] or 'low_action_novelty' in r['reasons']

    changed_poll=[]
    for i in range(5):
        changed_poll += [
            {'type':'action','tool':'poll','args':{'job':'abc'}},
            {'type':'result','output':{'percent':20*(i+1)}},
            {'type':'progress','marker':f'task_state_changed:{20*(i+1)}'},
            {'type':'turn'}]
    code,r=run(changed_poll)
    assert code in (0,2), (code,r)
    assert r['no_progress_count'] < 4
    print('all trajectory guard tests passed')
    return 0

if __name__=='__main__': raise SystemExit(main())
