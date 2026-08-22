#!/usr/bin/env python3
import argparse, ipaddress, socket, sys, urllib.parse
from pathlib import Path
import yaml

def load_policy(path):
    with open(path, encoding='utf-8') as f: return yaml.safe_load(f)

def blocked(ip, cidrs):
    addr=ipaddress.ip_address(ip)
    return any(addr in ipaddress.ip_network(c) for c in cidrs)

def main():
    p=argparse.ArgumentParser(description='Validate an outbound URL against an SSRF egress policy.')
    p.add_argument('url'); p.add_argument('--policy', default=str(Path(__file__).parents[1]/'config/policy.yaml'))
    a=p.parse_args(); policy=load_policy(a.policy); u=urllib.parse.urlsplit(a.url)
    if not u.scheme or not u.hostname or u.username or u.password:
        print('DENY invalid URL or userinfo', file=sys.stderr); return 2
    if u.scheme.lower() not in policy['allowed_schemes']:
        print('DENY scheme', file=sys.stderr); return 3
    host=u.hostname.rstrip('.').lower()
    if any(host.endswith(s.lower()) for s in policy.get('blocked_host_suffixes', [])):
        print('DENY host suffix', file=sys.stderr); return 4
    if host not in [h.lower() for h in policy.get('allowed_hosts', [])]:
        print('DENY host not allowlisted', file=sys.stderr); return 5
    try:
        infos=socket.getaddrinfo(host, u.port or 443, type=socket.SOCK_STREAM)
        ips=sorted({x[4][0] for x in infos})
    except socket.gaierror as e:
        print(f'DENY DNS failure: {e}', file=sys.stderr); return 6
    if not ips: print('DENY no DNS answers', file=sys.stderr); return 6
    bad=[ip for ip in ips if blocked(ip, policy['blocked_cidrs']) or not ipaddress.ip_address(ip).is_global]
    if bad:
        print('DENY non-public DNS answer: '+','.join(bad), file=sys.stderr); return 7
    print('ALLOW '+host+' -> '+','.join(ips)); return 0
if __name__=='__main__': raise SystemExit(main())
