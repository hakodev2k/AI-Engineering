#!/usr/bin/env python3
from __future__ import annotations
import json, subprocess, sys, tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent; GUARD=ROOT/'scripts'/'lifecycle_guard.py'; POLICY=ROOT/'config'/'policy.json'; CASES=ROOT/'tests'/'cases.json'
def main()->int:
    try: cases=json.loads(CASES.read_text(encoding='utf-8'))
    except Exception as exc: print(exc,file=sys.stderr); return 2
    failures=0
    for case in cases:
        with tempfile.NamedTemporaryFile('w',encoding='utf-8',suffix='.json',delete=False) as f:
            json.dump(case['record'],f,ensure_ascii=False); path=Path(f.name)
        try:
            r=subprocess.run([sys.executable,str(GUARD),str(path),'--policy',str(POLICY),'--phase',case['phase']],capture_output=True,text=True,check=False)
            try: report=json.loads(r.stdout) if r.stdout.strip() else {}
            except Exception: report={}
            ok=r.returncode==case['expected_exit'] and report.get('decision')==case['expected_decision']
            print(('PASS' if ok else 'FAIL')+': '+case['name'])
            if not ok:
                failures+=1; print(f"expected exit={case['expected_exit']} decision={case['expected_decision']} actual exit={r.returncode}\n{r.stdout}{r.stderr}")
        finally: path.unlink(missing_ok=True)
    return 1 if failures else 0
if __name__=='__main__': raise SystemExit(main())
