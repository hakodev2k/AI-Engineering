#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def read_events(path):
    out=[]
    try:
        for n,line in enumerate(Path(path).read_text(encoding='utf-8').splitlines(),1):
            if not line.strip(): continue
            obj=json.loads(line)
            if not isinstance(obj,dict): raise ValueError(f'line {n} is not an object')
            out.append(obj)
    except Exception as e:
        raise ValueError(f'cannot parse trace: {e}')
    return out

def classify(events, stall_ms):
    retries=sum(1 for e in events if e.get('event')=='retry')
    ambiguous=any(e.get('event')=='tool' and e.get('side_effect') and e.get('status') in {'unknown','partial'} for e in events)
    errors=[e for e in events if e.get('event')=='provider_error']
    terminal=any(e.get('event')=='terminal_response' for e in events)
    max_stall=max([int(e.get('stall_ms',0)) for e in events]+[0])
    classes=[]
    for e in errors:
        code=str(e.get('code','')).lower()
        if code in {'401','403','auth'}: classes.append('auth')
        elif code in {'429','quota','rate_limit'}: classes.append('quota')
        elif code.startswith('5') or code in {'timeout','connection','overloaded'}: classes.append('transient')
        elif code in {'400','schema','invalid_request'}: classes.append('semantic')
        else: classes.append('unknown')
    return retries,ambiguous,errors,terminal,max_stall,classes

def main():
    p=argparse.ArgumentParser()
    p.add_argument('--trace',required=True); p.add_argument('--max-retries',type=int,default=3)
    p.add_argument('--stall-ms',type=int,default=30000); p.add_argument('--output')
    a=p.parse_args()
    if a.max_retries<0 or a.stall_ms<1: print('invalid limits',file=sys.stderr); return 2
    try: events=read_events(a.trace)
    except ValueError as e: print(e,file=sys.stderr); return 2
    retries,ambiguous,errors,terminal,max_stall,classes=classify(events,a.stall_ms)
    if ambiguous: decision='RECONCILE'; reason='ambiguous side-effect status'
    elif not errors and terminal: decision='NONE'; reason='run completed'
    elif retries>=a.max_retries: decision='STOP'; reason='retry budget exhausted'
    elif any(c in {'auth','semantic','unknown'} for c in classes): decision='STOP'; reason='non-portable or unclassified provider failure'
    elif errors and (max_stall>=a.stall_ms or len(errors)>=2): decision='FAILOVER'; reason='bounded recovery threshold reached'
    elif errors: decision='RETRY'; reason='transient failure within budget'
    else: decision='STOP'; reason='missing terminal response without classified provider error'
    out={'decision':decision,'reason':reason,'retries':retries,'provider_errors':len(errors),'failure_classes':classes,'max_stall_ms':max_stall,'terminal_response':terminal,'ambiguous_side_effect':ambiguous}
    text=json.dumps(out,indent=2,sort_keys=True)
    if a.output: Path(a.output).write_text(text+'\n',encoding='utf-8')
    print(text)
    return 0 if decision in {'NONE','RETRY','FAILOVER'} else 3
if __name__=='__main__': sys.exit(main())
