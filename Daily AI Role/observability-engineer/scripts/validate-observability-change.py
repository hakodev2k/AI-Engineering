#!/usr/bin/env python3
import json, sys
REQ=['change_id','service','goal','criticality','signals','dimensions','contains_sensitive_data','owner','verification']
CRIT={'low','medium','high','critical'}
BAD_DIM={'user_id','request_id','trace_id','session_id','email','raw_url'}
def fail(msg):
    print(f'ERROR: {msg}', file=sys.stderr); return 1
def main():
    if len(sys.argv)!=2: return fail('usage: validate-observability-change.py <change.json>') or 2
    try:
        with open(sys.argv[1],encoding='utf-8') as f: d=json.load(f)
    except (OSError,json.JSONDecodeError) as e:
        print(f'ERROR: {e}',file=sys.stderr); return 2
    missing=[k for k in REQ if k not in d]
    if missing: return fail('missing: '+', '.join(missing))
    if d['criticality'] not in CRIT: return fail('invalid criticality')
    if not isinstance(d['signals'],list) or not d['signals']: return fail('signals must be non-empty list')
    if not isinstance(d['verification'],list) or not d['verification']: return fail('verification must be non-empty list')
    dims=set(d.get('dimensions',[]))
    risky=sorted(dims & BAD_DIM)
    if risky: return fail('potential high-cardinality/sensitive dimensions require redesign or explicit review: '+', '.join(risky))
    if d.get('contains_sensitive_data') and not d.get('approval_required',False): return fail('sensitive telemetry requires approval_required=true')
    print('OK: observability change is structurally valid'); return 0
if __name__=='__main__': sys.exit(main())
