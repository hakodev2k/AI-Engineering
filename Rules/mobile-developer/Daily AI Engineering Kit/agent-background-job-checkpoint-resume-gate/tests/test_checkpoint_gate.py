import json, subprocess, sys
from pathlib import Path

SCRIPT=Path(__file__).parents[1]/'scripts'/'checkpoint_gate.py'

def run(*args): return subprocess.run([sys.executable,str(SCRIPT),*args],text=True,capture_output=True)

def test_init_verify_and_complete(tmp_path):
    inp=tmp_path/'input.txt'; inp.write_text('abc',encoding='utf-8')
    cp=tmp_path/'cp.json'
    r=run('init','--checkpoint',str(cp),'--job-id','j1','--job-type','import','--input',str(inp)); assert r.returncode==0
    r=run('verify','--checkpoint',str(cp),'--job-id','j1','--job-type','import','--input',str(inp)); assert r.returncode==0
    r=run('update','--checkpoint',str(cp),'--cursor','{"page":2}','--processed-count','50','--status','completed'); assert r.returncode==0
    data=json.loads(cp.read_text()); assert data['status']=='completed' and data['cursor']=={'page':2}
    r=run('verify','--checkpoint',str(cp),'--job-id','j1','--job-type','import','--input',str(inp)); assert r.returncode==6

def test_changed_input_blocks_resume(tmp_path):
    inp=tmp_path/'input.txt'; inp.write_text('a',encoding='utf-8'); cp=tmp_path/'cp.json'
    assert run('init','--checkpoint',str(cp),'--job-id','j','--job-type','x','--input',str(inp)).returncode==0
    inp.write_text('b',encoding='utf-8')
    assert run('verify','--checkpoint',str(cp),'--job-id','j','--job-type','x','--input',str(inp)).returncode==5
