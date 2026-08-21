#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PY=sys.executable

def run(cmd, expect=(0,)):
    p=subprocess.run(cmd,cwd=ROOT,text=True,capture_output=True)
    if p.returncode not in expect:
        print(p.stdout); print(p.stderr,file=sys.stderr); raise SystemExit(f'command failed: {cmd}')
    return p

with tempfile.TemporaryDirectory() as td:
    out=Path(td)/'effective.json'
    run([PY,'scripts/validate-manifest.py','examples/conflict-manifest.json'])
    run([PY,'scripts/resolve-conflicts.py','--manifest','examples/conflict-manifest.json','--policy','config/instruction-policy.json','--out',str(out)])
    data=json.loads(out.read_text())
    if data['status']!='verified-pending-review':
        raise SystemExit(f'unexpected status: {data["status"]}')
    by_id={c['id']:c for c in data['conflicts']}
    if len(by_id)!=2:
        raise SystemExit('expected two conflicts')
    winners={c['winner'] for c in data['conflicts']}
    if 'stmt-1' not in winners or 'stmt-3' not in winners:
        raise SystemExit(f'unexpected winners: {winners}')
print('smoke-test: PASS')
