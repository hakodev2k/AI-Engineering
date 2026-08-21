import json, subprocess, sys
from pathlib import Path

ROOT=Path(__file__).parents[1]
SCRIPT=ROOT/"scripts"/"retry_episode_guard.py"
POLICY=ROOT/"config"/"retry-policy.json"

def run(tmp_path,event,episodes):
    e=tmp_path/"e.json"; l=tmp_path/"l.json"
    e.write_text(json.dumps(event),encoding="utf-8")
    l.write_text(json.dumps({"episodes":episodes}),encoding="utf-8")
    return subprocess.run([sys.executable,str(SCRIPT),str(e),"--ledger",str(l),"--policy",str(POLICY)],capture_output=True,text=True)

def base(**kw):
    d={"failure_class":"truncation","operation":"write_file","state_fingerprint":"abc","recovered":False,"strategy":"retry-same"}; d.update(kw); return d

def test_new_episode_can_retry(tmp_path):
    r=run(tmp_path,base(),[])
    assert r.returncode==0 and json.loads(r.stdout)["new_episode"] is True

def test_identical_strategy_requires_change(tmp_path):
    key=""
    # obtain deterministic key from first call
    first=run(tmp_path,base(),[]); key=json.loads(first.stdout)["episode_key"]
    eps=[{"id":"e1","key":key,"attempts":2,"last_strategy":"retry-same","status":"active"}]
    r=run(tmp_path,base(),eps)
    assert r.returncode==3

def test_budget_exhausted_stops(tmp_path):
    first=run(tmp_path,base(),[]); key=json.loads(first.stdout)["episode_key"]
    eps=[{"id":"e1","key":key,"attempts":3,"last_strategy":"split-output","status":"active"}]
    r=run(tmp_path,base(strategy="compress"),eps)
    assert r.returncode==4

def test_terminal_failure_never_retries(tmp_path):
    r=run(tmp_path,base(failure_class="authorization_denied"),[])
    assert r.returncode==4

def test_recovery_closes_episode(tmp_path):
    r=run(tmp_path,base(recovered=True),[])
    assert r.returncode==0 and json.loads(r.stdout)["reset"] is True
