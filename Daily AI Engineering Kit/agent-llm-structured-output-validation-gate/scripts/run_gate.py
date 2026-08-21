#!/usr/bin/env python3
import argparse, json, subprocess, sys
from pathlib import Path

def main():
    p=argparse.ArgumentParser(); p.add_argument('output'); p.add_argument('--config',default='config/gate.json'); a=p.parse_args()
    try: cfg=json.loads(Path(a.config).read_text(encoding='utf-8'))
    except Exception as e: print(f'ERROR config: {e}',file=sys.stderr); return 2
    cmd=[sys.executable,str(Path(__file__).with_name('validate_output.py')),a.output,'--schema',cfg['schema']]
    r=subprocess.run(cmd,text=True,capture_output=True)
    sys.stdout.write(r.stdout); sys.stderr.write(r.stderr)
    return r.returncode
if __name__=='__main__': sys.exit(main())
