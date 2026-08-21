#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

SCRIPT=Path(__file__).resolve().parents[1]/'scripts'/'validate-flags.py'

def run(payload, env='development', approval=None):
    with tempfile.TemporaryDirectory() as d:
        p=Path(d)/'flag.json'; p.write_text(json.dumps(payload),encoding='utf-8')
        cmd=[sys.executable,str(SCRIPT),str(p),'--environment',env]
        if approval is not None:
            a=Path(d)/'approval.json'; a.write_text(json.dumps({'approved':approval}),encoding='utf-8')
            cmd += ['--approval-file',str(a)]
        return subprocess.run(cmd,capture_output=True,text=True)

def valid():
    return {
      'name':'x','owner':'team','default':False,'environments':['production'],
      'kill_switch':True,'expiry_date':'2099-01-01','rollout_percent':5,
      'verification_metrics':[{'name':'errors','success_condition':'<1%'}]
    }

def main():
    assert run(valid()).returncode==0
    x=valid(); x['kill_switch']=False
    assert run(x).returncode==2
    x=valid(); x['rollout_percent']=50
    assert run(x,'production').returncode==2
    assert run(x,'production',True).returncode==0
    x=valid(); x['default']=True
    assert run(x,'production').returncode==2
    print('PASS: validate-flags tests')
    return 0

if __name__=='__main__': raise SystemExit(main())
