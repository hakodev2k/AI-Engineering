#!/usr/bin/env python3
import argparse, json, sys

def main():
    p=argparse.ArgumentParser(description='Validate privileged subagent provider/model routing')
    p.add_argument('route_json'); p.add_argument('request_json')
    a=p.parse_args()
    try:
        route=json.load(open(a.route_json,encoding='utf-8')); req=json.load(open(a.request_json,encoding='utf-8'))
    except Exception as e:
        print(f'input error: {e}',file=sys.stderr); return 2
    required=['provider','model','allowed_extensions']
    if any(k not in route for k in required) or not isinstance(route['allowed_extensions'],list):
        print('invalid route contract',file=sys.stderr); return 2
    actual_ext=req.get('extensions',[])
    if not isinstance(actual_ext,list):
        print('request extensions must be a list',file=sys.stderr); return 2
    errors=[]
    if req.get('provider') != route['provider']: errors.append('provider mismatch')
    if req.get('model') != route['model']: errors.append('model mismatch')
    forbidden=sorted(set(actual_ext)-set(route['allowed_extensions']))
    if forbidden: errors.append('unsupported extensions: '+','.join(forbidden))
    if route.get('privileged',True) and route.get('capability_status') not in ('verified','native-safe-fallback'):
        errors.append('privileged route capability not verified')
    out={'pass':not errors,'errors':errors,'provider':req.get('provider'),'model':req.get('model'),'extensions':actual_ext}
    print(json.dumps(out,indent=2))
    return 0 if not errors else 3

if __name__=='__main__': raise SystemExit(main())
