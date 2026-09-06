#!/usr/bin/env python3
import ipaddress, json, socket, sys
from urllib.parse import urlsplit

DENY_ATTRS=("is_private","is_loopback","is_link_local","is_multicast","is_reserved","is_unspecified")

def validate(url:str):
    p=urlsplit(url)
    if p.scheme.lower()!="https": return False,"scheme_must_be_https",[]
    if not p.hostname: return False,"missing_hostname",[]
    if p.username or p.password: return False,"userinfo_forbidden",[]
    try:
        infos=socket.getaddrinfo(p.hostname,p.port or 443,type=socket.SOCK_STREAM)
    except socket.gaierror as e:
        return False,f"dns_error:{e.errno}",[]
    addrs=[]
    for info in infos:
        raw=info[4][0].split('%',1)[0]
        try: ip=ipaddress.ip_address(raw)
        except ValueError: return False,"invalid_resolved_address",addrs
        addrs.append(str(ip))
        if any(getattr(ip,a) for a in DENY_ATTRS): return False,f"denied_address:{ip}",addrs
        if ip.version==4 and ip==ipaddress.ip_address("169.254.169.254"): return False,"metadata_address",addrs
    if not addrs: return False,"no_addresses",[]
    return True,"allowed",sorted(set(addrs))

def main():
    if len(sys.argv)!=2:
        print("usage: validate_mcp_url.py <url>",file=sys.stderr); return 2
    ok,reason,addrs=validate(sys.argv[1])
    print(json.dumps({"allowed":ok,"reason":reason,"resolved":addrs},sort_keys=True))
    return 0 if ok else 1
if __name__=="__main__": raise SystemExit(main())
