import json,subprocess,sys,tempfile
from pathlib import Path

SCRIPT=Path(__file__).parents[1]/"scripts"/"inference_loop_guard.py"

def run(events,args=None):
    with tempfile.NamedTemporaryFile("w",delete=False) as f:
        for event in events:f.write(json.dumps(event)+"\n")
        name=f.name
    p=subprocess.run([sys.executable,str(SCRIPT),name]+(args or []),capture_output=True,text=True)
    return p.returncode,json.loads(p.stdout)

good=[{"ts":0,"worker_id":"w","turn_id":"t","pending_input":True,"needs_follow_up":True,"progress_fingerprint":"a"},{"ts":30,"worker_id":"w","turn_id":"t","pending_input":False,"needs_follow_up":True,"progress_fingerprint":"b"}]
assert run(good)[0]==0

terminal=[{"ts":0,"worker_id":"w","turn_id":"t","pending_input":False,"needs_follow_up":False,"progress_fingerprint":"done"}]
assert run(terminal)[0]==2

loop=[{"ts":i*30,"worker_id":"w","turn_id":"t","pending_input":False,"needs_follow_up":True,"progress_fingerprint":"same"} for i in range(6)]
code,out=run(loop)
assert code==2 and out["violations"]
print("3 tests passed")
