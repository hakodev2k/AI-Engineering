#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
VALIDATOR=ROOT/'scripts'/'validate-assessment.py'
EXAMPLE=ROOT/'examples'/'assessment.example.json'

def run(*args):
    return subprocess.run([sys.executable,*map(str,args)], text=True, capture_output=True)

def main():
    if not VALIDATOR.is_file() or not EXAMPLE.is_file():
        print('required fixture missing', file=sys.stderr); return 2
    good=run(VALIDATOR,EXAMPLE)
    if good.returncode != 0:
        print(good.stdout+good.stderr, file=sys.stderr); return 1
    data=json.loads(EXAMPLE.read_text(encoding='utf-8'))
    data['verification']['retry_path_test']='not-run'
    with tempfile.TemporaryDirectory() as td:
        bad=Path(td)/'bad.json'; bad.write_text(json.dumps(data),encoding='utf-8')
        result=run(VALIDATOR,bad)
        if result.returncode == 0:
            print('validator incorrectly accepted pass with not-run verification', file=sys.stderr); return 1
    print('self-test passed')
    return 0

if __name__=='__main__': sys.exit(main())
