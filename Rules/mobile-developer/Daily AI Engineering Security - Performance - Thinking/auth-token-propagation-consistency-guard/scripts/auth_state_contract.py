#!/usr/bin/env python3
"""Validate redacted multi-component authentication state. Never accepts raw secrets."""
import argparse, json, pathlib, sys

FORBIDDEN = {'access_token','refresh_token','api_key','authorization','cookie','actor_biscuit','token'}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('input')
    ap.add_argument('--request-component', default='request')
    a = ap.parse_args()
    try:
        data = json.loads(pathlib.Path(a.input).read_text(encoding='utf-8'))
    except Exception as e:
        print(f'invalid input: {e}', file=sys.stderr); return 2
    if not isinstance(data, list) or not data:
        print('input must be a non-empty JSON array', file=sys.stderr); return 2
    principals = set(); request = None; errors = []
    for i, x in enumerate(data):
        if not isinstance(x, dict) or not isinstance(x.get('component'), str):
            errors.append(f'item {i}: invalid component'); continue
        lowered = {str(k).lower() for k in x}
        leaked = lowered & FORBIDDEN
        if leaked:
            errors.append(f"{x.get('component')}: forbidden secret-like fields: {sorted(leaked)}")
        p = x.get('principal')
        if p: principals.add(str(p))
        if x.get('component') == a.request_component: request = x
    if len(principals) > 1:
        errors.append('principal mismatch across components')
    if request is None:
        errors.append('request component missing')
    else:
        if not request.get('authenticated', False): errors.append('request path not authenticated')
        if not request.get('credential_present', False): errors.append('request credential missing')
        if request.get('expiry_state') in {'expired','missing','invalid'}: errors.append('request credential unusable')
        if principals and not request.get('principal'): errors.append('request principal unknown')
    ui_auth = any(x.get('component') in {'ui','session'} and x.get('authenticated') for x in data if isinstance(x,dict))
    if ui_auth and request and not request.get('credential_present', False):
        errors.append('split-brain: UI/session authenticated while request credential absent')
    result = {'status':'BLOCK' if errors else 'PASS','principals':sorted(principals),'errors':errors,'components':[x.get('component') for x in data if isinstance(x,dict)]}
    print(json.dumps(result, indent=2))
    return 3 if errors else 0

if __name__ == '__main__':
    raise SystemExit(main())
