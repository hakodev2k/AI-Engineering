#!/usr/bin/env python3
from __future__ import annotations
import json, subprocess, sys, tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent; GUARD=ROOT/'scripts'/'progress_guard.py'; POLICY=ROOT/'config'/'policy.json'; CASES=ROOT/'tests'/'cases.json'
def main()->int:
    try: cases=json.loads(CASES.read_text(encoding='utf-8'))
    except Exception as exc: print(exc,file=sys.stderr); return 2
    failures=0
    for case in cases:
        with tempfile.NamedTemporaryFile('w',encoding='utf-8',suffix='.jsonl',delete=False) as f:
            for event in case['events']: f.write(json.dumps(event,ensure_ascii=False)+'\n')
            path=Path(f.name)
        try:
            r=subprocess.run([sys.executable,str(GUARD),str(path),'--policy',str(POLICY)],capture_output=True,text=True,check=False)
            try: report=json.loads(r.stdout)
            except Exception: report={}
            ok=r.returncode==0 and report.get('decision')==case['expect']
            print(('PASS' if ok else 'FAIL')+': '+case['name'])
            if not ok: failures+=1; print(r.stdout+r.stderr)
        finally: path.unlink(missing_ok=True)
    return 1 if failures else 0
if __name__=='__main__': raise SystemExit(main())
