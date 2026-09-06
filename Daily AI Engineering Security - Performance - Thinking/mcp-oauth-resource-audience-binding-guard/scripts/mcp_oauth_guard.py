#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def validate(p):
    errors=[]
    req=['resource','expected_resource','audience','expected_audience','issuer','expected_issuer','scopes','allowed_scopes','token_passthrough']
    for k in req:
        if k not in p: errors.append(f'missing:{k}')
    if errors: return errors
    if not all(isinstance(p[k],str) and p[k].strip() for k in ['resource','expected_resource','audience','expected_audience','issuer','expected_issuer']): errors.append('identity_fields_must_be_nonempty_strings')
    if p.get('resource') != p.get('expected_resource'): errors.append('resource_mismatch')
    if p.get('audience') != p.get('expected_audience'): errors.append('audience_mismatch')
    if p.get('issuer') != p.get('expected_issuer'): errors.append('issuer_mismatch')
    if p.get('token_passthrough') is not False: errors.append('token_passthrough_forbidden')
    scopes=p.get('scopes'); allowed=p.get('allowed_scopes')
    if not isinstance(scopes,list) or not all(isinstance(x,str) for x in scopes): errors.append('scopes_must_be_string_list')
    if not isinstance(allowed,list) or not all(isinstance(x,str) for x in allowed): errors.append('allowed_scopes_must_be_string_list')
    if isinstance(scopes,list) and isinstance(allowed,list):
        extra=sorted(set(scopes)-set(allowed))
        if extra: errors.append('excessive_scopes:'+','.join(extra))
    return errors

def main():
    ap=argparse.ArgumentParser(description='Validate sanitized MCP OAuth resource-boundary policy metadata')
    ap.add_argument('policy', type=Path)
    a=ap.parse_args()
    try: data=json.loads(a.policy.read_text(encoding='utf-8'))
    except (OSError,json.JSONDecodeError) as e:
        print(f'ERROR: {e}', file=sys.stderr); return 2
    if not isinstance(data,dict): print('ERROR: policy must be a JSON object',file=sys.stderr); return 2
    errors=validate(data)
    if errors:
        print('BLOCK')
        for e in errors: print(f'- {e}')
        return 1
    print('PASS: resource/audience/issuer/scopes bound; token passthrough disabled')
    return 0
if __name__=='__main__': raise SystemExit(main())
