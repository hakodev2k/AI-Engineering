#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path
SCRIPT=Path(__file__).resolve().parents[1]/'scripts'/'failover_analyzer.py'

def run(events,max_retries=3):
    with tempfile.TemporaryDirectory() as d:
        f=Path(d)/'run.jsonl'
        f.write_text('\n'.join(json.dumps(e) for e in events)+'\n',encoding='utf-8')
        p=subprocess.run([sys.executable,str(SCRIPT),'--trace',str(f),'--max-retries',str(max_retries),'--stall-ms','30000'],capture_output=True,text=True)
        return p.returncode,json.loads(p.stdout)

def main():
    rc,o=run([{'event':'provider_error','code':'503','stall_ms':35000}]); assert rc==0 and o['decision']=='FAILOVER'
    rc,o=run([{'event':'provider_error','code':'timeout','stall_ms':5000}]); assert rc==0 and o['decision']=='RETRY'
    rc,o=run([{'event':'tool','side_effect':True,'status':'unknown'},{'event':'provider_error','code':'503'}]); assert rc==3 and o['decision']=='RECONCILE'
    rc,o=run([{'event':'retry'},{'event':'retry'},{'event':'provider_error','code':'503'}],2); assert rc==3 and o['decision']=='STOP'
    print('4 failover analyzer tests passed')
if __name__=='__main__': main()
