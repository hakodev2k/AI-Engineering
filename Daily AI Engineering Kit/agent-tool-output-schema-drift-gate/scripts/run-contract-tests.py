#!/usr/bin/env python3
import json, subprocess, sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
CASES=ROOT/'tests'/'cases.json'
VALIDATOR=ROOT/'scripts'/'validate-tool-output.py'
SCHEMA=ROOT/'schemas'/'tool-output-contract.schema.json'

def main():
    try: cases=json.loads(CASES.read_text(encoding='utf-8'))
    except Exception as exc:
        print(f'ERROR: {exc}',file=sys.stderr); return 2
    failed=0
    for case in cases:
        path=ROOT/case['file']; expected=case['valid']
        r=subprocess.run([sys.executable,str(VALIDATOR),'--input',str(path),'--schema',str(SCHEMA)],capture_output=True,text=True)
        actual=r.returncode==0
        status='PASS' if actual==expected else 'FAIL'
        print(f'{status}: {case["file"]} expected_valid={expected}')
        if status=='FAIL':
            failed+=1; print(r.stderr.strip())
    print(f'{len(cases)-failed}/{len(cases)} contract cases passed')
    return 1 if failed else 0
if __name__=='__main__': sys.exit(main())
