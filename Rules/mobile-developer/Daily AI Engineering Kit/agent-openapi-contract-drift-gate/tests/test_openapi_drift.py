#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts'/'openapi_drift.py'
POLICY=ROOT/'config'/'contract-policy.json'
BASE=ROOT/'examples'/'baseline.openapi.json'
BREAK=ROOT/'examples'/'breaking.openapi.json'

def run(candidate):
    with tempfile.TemporaryDirectory() as td:
        out=Path(td)/'report.json'
        p=subprocess.run([sys.executable,str(SCRIPT),str(BASE),str(candidate),'--policy',str(POLICY),'--output',str(out)],capture_output=True,text=True)
        data=json.loads(out.read_text(encoding='utf-8'))
        return p.returncode,data

def main():
    rc,data=run(BASE)
    assert rc==0, (rc,data)
    assert data['status']=='pass'
    rc,data=run(BREAK)
    assert rc==2, (rc,data)
    assert data['status']=='blocked'
    kinds={f['kind'] for f in data['findings']}
    assert 'changed-schema-type' in kinds
    assert 'removed-required-response-field' in kinds
    assert 'narrowed-enum' in kinds
    print('tests passed')
if __name__=='__main__': main()
