#!/usr/bin/env python3
import argparse, base64, json, sys, time
from pathlib import Path

try:
    import yaml
except ImportError:
    print('PyYAML is required: pip install pyyaml', file=sys.stderr)
    sys.exit(3)

def b64url_json(part):
    pad = '=' * (-len(part) % 4)
    try:
        return json.loads(base64.urlsafe_b64decode(part + pad))
    except Exception as exc:
        raise ValueError(f'invalid JWT segment: {exc}')

def load_policy(path):
    with open(path, encoding='utf-8') as f:
        p = yaml.safe_load(f) or {}
    required = ['accepted_issuers','required_audiences','required_scopes']
    missing = [k for k in required if k not in p]
    if missing:
        raise ValueError('policy missing keys: ' + ', '.join(missing))
    return p

def as_set(value):
    if value is None: return set()
    if isinstance(value, str): return set(value.split())
    if isinstance(value, list): return set(map(str, value))
    return {str(value)}

def evaluate(claims, policy, now=None):
    now = int(now or time.time())
    skew = int(policy.get('allowed_clock_skew_seconds', 0))
    findings=[]
    def block(code, message): findings.append({'severity':'block','code':code,'message':message})
    iss=claims.get('iss')
    if iss not in policy['accepted_issuers']: block('issuer_mismatch', f'issuer not allowed: {iss}')
    aud=as_set(claims.get('aud'))
    required_aud=set(map(str, policy['required_audiences']))
    if not aud.intersection(required_aud): block('audience_mismatch', f'audience {sorted(aud)} does not match {sorted(required_aud)}')
    scopes=as_set(claims.get('scp')) | as_set(claims.get('roles'))
    required_scopes=set(map(str, policy['required_scopes']))
    missing=sorted(required_scopes-scopes)
    if missing and not policy.get('allow_missing_scope', False): block('scope_missing', 'missing scopes/roles: '+', '.join(missing))
    for key in ('sub',):
        if policy.get(f'require_{key}', True) and not claims.get(key): block(f'{key}_missing', f'{key} claim required')
    if policy.get('require_azp_or_appid', True) and not (claims.get('azp') or claims.get('appid')): block('client_identity_missing','azp or appid claim required')
    exp=claims.get('exp'); nbf=claims.get('nbf'); iat=claims.get('iat')
    if policy.get('require_exp',True) and exp is None: block('exp_missing','exp claim required')
    elif exp is not None and int(exp)+skew < now: block('token_expired','token expired')
    if policy.get('require_nbf',True) and nbf is None: block('nbf_missing','nbf claim required')
    elif nbf is not None and int(nbf)-skew > now: block('token_not_yet_valid','nbf is in the future')
    if policy.get('require_iat',True) and iat is None: block('iat_missing','iat claim required')
    status='blocked' if any(f['severity']=='block' for f in findings) else 'passed'
    return {'status':status,'findings':findings,'claims_summary':{'iss':iss,'aud':sorted(aud),'scopes_or_roles':sorted(scopes),'sub_present':bool(claims.get('sub')),'client_id':claims.get('azp') or claims.get('appid')}}

def main():
    ap=argparse.ArgumentParser(description='Validate JWT claims against service audience/scope policy. Signature verification must be performed by the application or gateway before this gate.')
    ap.add_argument('--token')
    ap.add_argument('--claims-file')
    ap.add_argument('--policy', default='config/policy.yaml')
    ap.add_argument('--output')
    args=ap.parse_args()
    if bool(args.token)==bool(args.claims_file):
        ap.error('provide exactly one of --token or --claims-file')
    try:
        policy=load_policy(args.policy)
        if args.token:
            parts=args.token.split('.')
            if len(parts)!=3: raise ValueError('JWT must contain 3 segments')
            claims=b64url_json(parts[1])
        else:
            claims=json.loads(Path(args.claims_file).read_text(encoding='utf-8'))
        result=evaluate(claims,policy)
        text=json.dumps(result,indent=2,sort_keys=True)
        if args.output: Path(args.output).write_text(text+'\n',encoding='utf-8')
        print(text)
        sys.exit(0 if result['status']=='passed' else 2)
    except Exception as exc:
        print(json.dumps({'status':'error','error':str(exc)}), file=sys.stderr)
        sys.exit(3)
if __name__=='__main__': main()
