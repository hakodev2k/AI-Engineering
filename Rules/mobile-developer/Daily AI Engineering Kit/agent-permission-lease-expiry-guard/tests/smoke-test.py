#!/usr/bin/env python3
import json,subprocess,tempfile,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
PY=sys.executable

def run(args,ok=True):
    p=subprocess.run([PY,*args],cwd=ROOT,text=True,capture_output=True)
    if ok and p.returncode!=0: raise AssertionError(p.stderr+p.stdout)
    if not ok and p.returncode==0: raise AssertionError('expected failure')
    return p

def main():
    with tempfile.TemporaryDirectory() as d:
        d=Path(d); lease=d/'lease.json'; action=d/'action.json'; rev=d/'rev.json'
        run(['scripts/permission_lease.py','issue','--actor','agent-a','--operation','op-1','--capability','repo.write','--resource','repo:x','--seconds','600','--max-uses','1','--out',str(lease)])
        x={'operation_id':'op-1','actor_id':'agent-a','capability':'repo.write','resource':'repo:x','risk_category':'standard','action_fingerprint':'a'*64}; action.write_text(json.dumps(x))
        assert json.loads(run(['scripts/evaluate-permission-gate.py','--lease',str(lease),'--action',str(action)]).stdout)['decision']=='allow'
        bad=dict(x,resource='repo:y'); action.write_text(json.dumps(bad)); assert json.loads(run(['scripts/evaluate-permission-gate.py','--lease',str(lease),'--action',str(action)],ok=False).stdout)['decision']=='blocked'
        action.write_text(json.dumps(x)); run(['scripts/consume-permission-lease.py','--lease',str(lease)]); assert json.loads(lease.read_text())['status']=='consumed'
        assert json.loads(run(['scripts/evaluate-permission-gate.py','--lease',str(lease),'--action',str(action)],ok=False).stdout)['decision']=='blocked'
        rev.write_text(json.dumps({'lease_id':json.loads(lease.read_text())['lease_id'],'verified':True,'source':'test'}))
        assert json.loads(run(['scripts/evaluate-final-gate.py','--lease',str(lease),'--action',str(action),'--revocation-evidence',str(rev)]).stdout)['decision']=='verified'
        print('smoke tests passed')
if __name__=='__main__': main()
