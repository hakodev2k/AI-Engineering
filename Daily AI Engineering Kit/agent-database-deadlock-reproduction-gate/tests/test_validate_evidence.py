import json, subprocess, sys, tempfile
from pathlib import Path

SCRIPT=Path(__file__).parents[1]/'scripts'/'validate-evidence.py'

def run(data):
    with tempfile.NamedTemporaryFile('w',suffix='.json',delete=False,encoding='utf-8') as f:
        json.dump(data,f); name=f.name
    return subprocess.run([sys.executable,str(SCRIPT),name],capture_output=True,text=True)

def base():
    return {"status":"investigating","database":"test-db","transactions":[{"name":"a","steps":["x","wait y"]},{"name":"b","steps":["y","wait x"]}],"evidence":[],"root_cause":None,"fix":None,"verification":{"reproduction_before":False,"reproduction_after":False}}

def test_valid_investigation():
    assert run(base()).returncode==0

def test_verified_requires_before_reproduction():
    d=base(); d['status']='verified'; assert run(d).returncode!=0

def test_verified_rejects_after_reproduction():
    d=base(); d['status']='verified'; d['verification']={'reproduction_before':True,'reproduction_after':True}; assert run(d).returncode!=0

def test_verified_contract():
    d=base(); d['status']='verified'; d['verification']={'reproduction_before':True,'reproduction_after':False}; assert run(d).returncode==0
