import json, subprocess, sys
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/'scripts/webhook_gate.py'
def run(tmp,key,body,*extra):
    f=tmp/'payload'; f.write_bytes(body)
    r=subprocess.run([sys.executable,str(SCRIPT),'--db',str(tmp/'gate.db'),'--key',key,'--payload',str(f),*extra],capture_output=True,text=True)
    return r.returncode,json.loads(r.stdout)
def test_duplicate_and_mismatch(tmp_path):
    code,out=run(tmp_path,'evt-1',b'{"x":1}')
    assert code==0 and out['status']=='accepted'
    code,out=run(tmp_path,'evt-1',b'{"x":1}')
    assert code==3 and out['status']=='duplicate'
    code,out=run(tmp_path,'evt-1',b'{"x":2}')
    assert code==4 and out['status']=='rejected'
def test_complete_is_duplicate(tmp_path):
    assert run(tmp_path,'evt-2',b'a')[0]==0
    assert run(tmp_path,'evt-2',b'a','--complete')[0]==0
    code,out=run(tmp_path,'evt-2',b'a')
    assert code==3 and out['status']=='duplicate'
