#!/usr/bin/env python3
"""Detect unsafe credential forwarding across HTTP redirects using recorded request chains."""
import argparse, ipaddress, json, sys
from pathlib import Path
from urllib.parse import urlparse

SENSITIVE = {"authorization", "proxy-authorization", "cookie", "x-api-key", "api-key"}

def host(url):
    return (urlparse(url).hostname or "").lower().rstrip(".")

def scheme(url):
    return (urlparse(url).scheme or "").lower()

def registrable_like(h):
    parts=h.split(".")
    return ".".join(parts[-2:]) if len(parts)>=2 else h

def is_private(h):
    try: return ipaddress.ip_address(h).is_private or ipaddress.ip_address(h).is_loopback or ipaddress.ip_address(h).is_link_local
    except ValueError: return h in {"localhost"} or h.endswith(".local")

def allowed_destination(h, policy):
    exact={x.lower().rstrip('.') for x in policy.get('allowed_redirect_hosts',[])}
    suffix=[x.lower().lstrip('.').rstrip('.') for x in policy.get('allowed_redirect_suffixes',[])]
    return h in exact or any(h==s or h.endswith('.'+s) for s in suffix)

def analyze(chain, policy):
    findings=[]
    hops=chain.get('hops',[])
    max_hops=int(policy.get('max_redirect_hops',5))
    if len(hops)-1>max_hops:
        findings.append({'code':'too-many-redirects','severity':'high','hop':max_hops+1,'detail':f'redirect count exceeds {max_hops}'})
    for i in range(1,len(hops)):
        prev,cur=hops[i-1],hops[i]
        ph,ch=host(prev['url']),host(cur['url'])
        forwarded={k.lower() for k in cur.get('headers',{})} & SENSITIVE
        if scheme(prev['url'])=='https' and scheme(cur['url'])!='https':
            findings.append({'code':'https-downgrade','severity':'critical','hop':i,'detail':cur['url']})
        cross=ph!=ch
        if cross and forwarded:
            findings.append({'code':'credential-forwarded-cross-host','severity':'critical','hop':i,'detail':','.join(sorted(forwarded))})
        if cross and registrable_like(ph)!=registrable_like(ch) and not allowed_destination(ch,policy):
            findings.append({'code':'unapproved-cross-site-redirect','severity':'high','hop':i,'detail':f'{ph} -> {ch}'})
        if policy.get('block_private_destinations',True) and is_private(ch) and not allowed_destination(ch,policy):
            findings.append({'code':'private-network-redirect','severity':'critical','hop':i,'detail':ch})
    return findings

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--input',required=True,help='JSON request-chain evidence')
    ap.add_argument('--policy',required=True)
    ap.add_argument('--output',default='redirect-gate-report.json')
    args=ap.parse_args()
    try:
        chain=json.loads(Path(args.input).read_text(encoding='utf-8'))
        policy=json.loads(Path(args.policy).read_text(encoding='utf-8'))
        if not isinstance(chain.get('hops'),list) or not chain['hops']:
            raise ValueError('input.hops must be a non-empty array')
        for h in chain['hops']:
            if not isinstance(h.get('url'),str) or not host(h['url']): raise ValueError('each hop requires an absolute URL')
        findings=analyze(chain,policy)
        report={'status':'blocked' if findings else 'passed','findings':findings,'hop_count':len(chain['hops'])}
        Path(args.output).write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
        print(json.dumps(report))
        return 2 if findings else 0
    except (OSError,json.JSONDecodeError,ValueError) as e:
        print(f'validation error: {e}',file=sys.stderr); return 3
if __name__=='__main__': raise SystemExit(main())
