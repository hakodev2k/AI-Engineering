#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path
from urllib.parse import urlparse

def load(path):
    try: return json.loads(Path(path).read_text(encoding='utf-8'))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f'{path}: {exc}') from exc

def norm_origin(value):
    if not isinstance(value,str): return None
    p=urlparse(value)
    if p.scheme not in ('http','https') or not p.hostname: return None
    port=p.port
    default=(p.scheme=='http' and port in (None,80)) or (p.scheme=='https' and port in (None,443))
    return f'{p.scheme}://{p.hostname.lower()}' + ('' if default else f':{port}')

def main():
    ap=argparse.ArgumentParser(description='Fail-closed authenticated browser action policy guard.')
    ap.add_argument('--policy',required=True); ap.add_argument('--event',required=True); a=ap.parse_args()
    try: policy,event=load(a.policy),load(a.event)
    except ValueError as exc:
        print(json.dumps({'decision':'BLOCK','reasons':[str(exc)]})); return 2
    reasons=[]
    required=['source_origin','target_origin','authenticated','action','derived_from_untrusted_content','human_approved']
    for k in required:
        if k not in event: reasons.append(f'missing:{k}')
    src=norm_origin(event.get('source_origin')); dst=norm_origin(event.get('target_origin'))
    if not src: reasons.append('invalid:source_origin')
    if not dst: reasons.append('invalid:target_origin')
    action=event.get('action'); sensitive=set(policy.get('sensitive_actions',[]))
    known=sensitive|{'read_public','read_private','navigate','click_nonconsequential'}
    if policy.get('block_unknown_actions',True) and action not in known: reasons.append('unknown_action')
    is_sensitive=action in sensitive
    if event.get('authenticated') is True and is_sensitive and policy.get('require_human_approval_for_authenticated_sensitive_actions',True) and event.get('human_approved') is not True:
        reasons.append('authenticated_sensitive_action_requires_approval')
    if policy.get('block_untrusted_cross_origin_sensitive_actions',True) and event.get('derived_from_untrusted_content') is True and is_sensitive and src and dst and src!=dst:
        reasons.append('untrusted_cross_origin_sensitive_transition')
    # Trusted-origin configuration never overrides the explicit approval/provenance rules above.
    decision='BLOCK' if reasons else 'ALLOW'
    print(json.dumps({'decision':decision,'reasons':reasons,'source_origin':src,'target_origin':dst,'action':action},indent=2))
    return 2 if reasons else 0

if __name__=='__main__': sys.exit(main())
