#!/usr/bin/env python3
import json, pathlib, sys
REQUIRED={'status','provider','entryPoint','rawBodyAccess','signature','timestamp','replay','tests','approvals','risks'}

def fail(msg): print(msg,file=sys.stderr); return 1

def main():
    if len(sys.argv)!=2: return fail('usage: validate_evidence.py <evidence.json>')
    p=pathlib.Path(sys.argv[1])
    if not p.is_file(): return fail('evidence file not found')
    try: d=json.loads(p.read_text(encoding='utf-8'))
    except Exception as e: return fail(f'invalid json: {e}')
    missing=REQUIRED-set(d)
    extra=set(d)-REQUIRED
    if missing or extra: return fail(f'fields mismatch; missing={sorted(missing)} extra={sorted(extra)}')
    if d['status'] not in {'investigating','ready','implemented','verified','blocked'}: return fail('invalid status')
    if not isinstance(d['provider'],str) or not d['provider'].strip(): return fail('provider required')
    if not isinstance(d['entryPoint'],str) or not d['entryPoint'].strip(): return fail('entryPoint required')
    for k in ('rawBodyAccess','signature','timestamp','replay'):
        if not isinstance(d[k],dict): return fail(f'{k} must be object')
    if d['status'] in {'ready','implemented','verified'} and not d['rawBodyAccess'].get('available'): return fail('raw body unavailable for actionable status')
    if d['status']=='verified':
        if not d['signature'].get('constantTimeCompare'): return fail('verified requires constant-time comparison')
        if not d['replay'].get('atomicClaim'): return fail('verified requires atomic replay claim')
        if not d['tests'] or any(t.get('result')!='pass' for t in d['tests']): return fail('verified requires all recorded tests passing')
    print('evidence valid')
    return 0
if __name__=='__main__': raise SystemExit(main())
