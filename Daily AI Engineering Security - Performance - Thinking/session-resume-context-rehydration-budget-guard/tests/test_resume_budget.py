import json, subprocess, sys, tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; SCRIPT=ROOT/'scripts'/'resume_budget.py'; POLICY=ROOT/'config'/'budget.json'

def run(items):
    with tempfile.TemporaryDirectory() as d:
        p=Path(d)/'c.json'; p.write_text(json.dumps({'items':items}),encoding='utf-8')
        return subprocess.run([sys.executable,str(SCRIPT),str(p),'--policy',str(POLICY)],capture_output=True,text=True)

def item(i,section,content,critical=False):
    return {'id':i,'section':section,'content':content,'critical':critical,'source':'fixture'}

def test_preserves_critical_and_deduplicates():
    r=run([item('g','active_goal','ship fix'),item('a','history','same text'),item('b','history','same   text')])
    assert r.returncode in (0,3)
    o=json.loads(r.stdout); assert 'g' in o['critical_ids']; assert len(o['duplicates'])==1

def test_normal_small_bundle_fits():
    r=run([item('g','active_goal','goal'),item('c','acceptance_criteria','tests pass')])
    assert r.returncode==0

def test_old_logs_are_lazy():
    r=run([item('g','active_goal','goal'),item('l','old_logs','x'*1000)])
    assert r.returncode==3
    o=json.loads(r.stdout); assert any(x['id']=='l' for x in o['lazy'])
