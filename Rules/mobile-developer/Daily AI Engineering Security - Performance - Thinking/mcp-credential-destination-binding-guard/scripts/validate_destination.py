#!/usr/bin/env python3
from __future__ import annotations
import argparse, ipaddress, json, sys
from pathlib import Path
from urllib.parse import urlsplit

ALLOW, INVALID, APPROVAL, DENY = 0, 2, 4, 5

def load(path: Path):
    try: data=json.loads(path.read_text(encoding='utf-8'))
    except (OSError,json.JSONDecodeError) as e: raise ValueError(f'cannot read {path}: {e}') from e
    if not isinstance(data,dict): raise ValueError(f'{path} must contain a JSON object')
    return data

def main():
    p=argparse.ArgumentParser(description='Validate credential-bearing outbound destination')
    p.add_argument('input',type=Path); p.add_argument('--policy',type=Path,required=True)
    a=p.parse_args()
    try:
        d,c=load(a.input),load(a.policy)
        url=d.get('url'); cred=d.get('credential_class'); approval=d.get('approval',{})
        if not isinstance(url,str) or not url: raise ValueError('url must be non-empty string')
        if not isinstance(cred,str) or not cred: raise ValueError('credential_class must be non-empty string')
        if not isinstance(approval,dict): raise ValueError('approval must be object')
        u=urlsplit(url)
        findings=[]
        if c.get('require_https',True) and u.scheme.lower()!='https': findings.append('https required')
        if not u.hostname: findings.append('hostname required')
        if not c.get('allow_userinfo',False) and (u.username is not None or u.password is not None): findings.append('userinfo forbidden')
        port=u.port or (443 if u.scheme.lower()=='https' else None)
        if port not in c.get('allowed_ports',[443]): findings.append(f'port {port} not allowed')
        host=(u.hostname or '').rstrip('.').lower()
        try: ipaddress.ip_address(host); is_ip=True
        except ValueError: is_ip=False
        if is_ip and not c.get('allow_ip_literals',False): findings.append('IP literals forbidden')
        cp=c.get('credential_policies',{}).get(cred)
        if not isinstance(cp,dict): findings.append('credential class has no policy')
        suffixes=cp.get('allowed_host_suffixes',[]) if isinstance(cp,dict) else []
        host_ok=any(host.endswith(s.lower()) and host!=s.lower().lstrip('.') for s in suffixes)
        if not host_ok: findings.append('destination not allowed for credential class')
        binding=f'{cred}|{u.scheme.lower()}://{host}:{port}'
        if findings:
            result={'decision':'deny','binding':binding,'findings':findings}; code=DENY
        elif cp.get('require_explicit_approval',False) and not (approval.get('granted') is True and approval.get('binding')==binding):
            result={'decision':'approval_required','binding':binding,'findings':['explicit destination-bound approval required']}; code=APPROVAL
        else:
            result={'decision':'allow','binding':binding,'findings':[]}; code=ALLOW
    except (ValueError,TypeError) as e:
        print(json.dumps({'decision':'invalid','error':str(e)}),file=sys.stderr); return INVALID
    print(json.dumps(result,indent=2)); return code
if __name__=='__main__': raise SystemExit(main())
