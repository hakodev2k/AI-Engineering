import json, subprocess, sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]

def test_policy_valid():
    r=subprocess.run([sys.executable,str(ROOT/'scripts/validate_policy.py'),str(ROOT/'config/policy.json')])
    assert r.returncode==0

def test_success_has_one_attempt(tmp_path):
    evidence=tmp_path/'e.json'
    r=subprocess.run([sys.executable,str(ROOT/'scripts/retry_gate.py'),'--policy',str(ROOT/'config/policy.json'),'--evidence',str(evidence),sys.executable,'-c','print("ok")'])
    assert r.returncode==0
    d=json.loads(evidence.read_text())
    assert len(d['attempts'])==1 and d['attempts'][0]['exit_code']==0

def test_failure_is_bounded(tmp_path):
    policy=tmp_path/'p.json'; evidence=tmp_path/'e.json'
    d=json.loads((ROOT/'config/policy.json').read_text()); d['max_attempts']=2; d['base_delay_ms']=0; d['max_delay_ms']=0
    policy.write_text(json.dumps(d))
    r=subprocess.run([sys.executable,str(ROOT/'scripts/retry_gate.py'),'--policy',str(policy),'--evidence',str(evidence),sys.executable,'-c','raise SystemExit(7)'])
    assert r.returncode==20
    assert len(json.loads(evidence.read_text())['attempts'])==2
