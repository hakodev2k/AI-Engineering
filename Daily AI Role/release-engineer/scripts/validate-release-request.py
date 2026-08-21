#!/usr/bin/env python3
import json, sys
REQ=['release_id','service','version','source_ref','artifact','target_environment','risk_level','rollback_strategy','owner']
ENVS={'dev','test','staging','production'}
RISKS={'low','medium','high','critical'}
def fail(msg,code=1): print(f'ERROR: {msg}',file=sys.stderr); sys.exit(code)
def main():
    if len(sys.argv)!=2: fail('usage: validate-release-request.py <request.json>',2)
    try:
        with open(sys.argv[1],encoding='utf-8') as f: d=json.load(f)
    except (OSError,json.JSONDecodeError) as e: fail(str(e),2)
    missing=[k for k in REQ if not d.get(k)]
    if missing: fail('missing required fields: '+', '.join(missing))
    if d['target_environment'] not in ENVS: fail('invalid target_environment')
    if d['risk_level'] not in RISKS: fail('invalid risk_level')
    if len(str(d['rollback_strategy']).strip())<10: fail('rollback_strategy is too short')
    if d['target_environment']=='production' and '@sha256:' not in d['artifact']:
        fail('production artifact should use an immutable digest reference')
    print('VALID')
if __name__=='__main__': main()
