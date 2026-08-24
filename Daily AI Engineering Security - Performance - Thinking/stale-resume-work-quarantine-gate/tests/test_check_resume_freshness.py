import json, subprocess, sys, tempfile
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/'scripts'/'check_resume_freshness.py'

def run(data):
    with tempfile.NamedTemporaryFile('w',delete=False,encoding='utf-8') as f:
        json.dump(data,f); name=f.name
    p=subprocess.run([sys.executable,str(SCRIPT),name,'--max-age-seconds','300','--json'],capture_output=True,text=True)
    Path(name).unlink(missing_ok=True)
    return p

def env(**kw):
    d={'session_id':'s1','task_id':'t1','last_real_activity_at':'2026-08-24T07:00:00Z','current_time':'2026-08-24T07:03:00Z','prior_state':'running','provenance':{'source':'session-event-log'},'side_effect_capable':False}
    d.update(kw); return d

def test_recent_interruption_allowed():
    p=run(env()); assert p.returncode==0; assert json.loads(p.stdout)['decision']=='allow'

def test_stale_activity_quarantined_even_if_storage_is_fresh():
    p=run(env(last_real_activity_at='2026-08-01T00:00:00Z',updated_at='2026-08-24T07:02:59Z'))
    assert p.returncode==1; assert 'stale_activity' in json.loads(p.stdout)['reasons']

def test_terminal_task_denied():
    p=run(env(prior_state='completed')); assert p.returncode==1; assert json.loads(p.stdout)['decision']=='deny'

def test_side_effect_requires_current_approval():
    p=run(env(side_effect_capable=True,approval_current=False)); assert p.returncode==1; assert 'side_effect_reapproval_required' in json.loads(p.stdout)['reasons']

def test_missing_provenance_quarantined():
    d=env(); del d['provenance']; p=run(d); assert p.returncode==1; assert json.loads(p.stdout)['decision']=='quarantine'
