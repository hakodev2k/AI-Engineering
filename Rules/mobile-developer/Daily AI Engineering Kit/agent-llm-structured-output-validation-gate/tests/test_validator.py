#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
VALID=ROOT/'examples/valid-output.json'
SCHEMA=ROOT/'schemas/agent-output.schema.json'
SCRIPT=ROOT/'scripts/validate_output.py'

def run(path): return subprocess.run([sys.executable,str(SCRIPT),str(path),'--schema',str(SCHEMA)],capture_output=True,text=True)

def main():
    assert run(VALID).returncode==0
    data=json.loads(VALID.read_text()); data['evidence']=[]
    with tempfile.NamedTemporaryFile('w',suffix='.json',delete=False) as f: json.dump(data,f); bad=Path(f.name)
    try: assert run(bad).returncode==1
    finally: bad.unlink(missing_ok=True)
    data=json.loads(VALID.read_text()); data['verification']['semanticChecksPassed']=False
    with tempfile.NamedTemporaryFile('w',suffix='.json',delete=False) as f: json.dump(data,f); bad2=Path(f.name)
    try: assert run(bad2).returncode==1
    finally: bad2.unlink(missing_ok=True)
    print('tests passed'); return 0
if __name__=='__main__': sys.exit(main())
