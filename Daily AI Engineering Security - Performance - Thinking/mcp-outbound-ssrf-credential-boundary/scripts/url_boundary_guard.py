#!/usr/bin/env python3
import argparse, ipaddress, json
from pathlib import Path
from urllib.parse import urlsplit

def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))

def domain_allowed(host, allowed):
    h=host.rstrip(".").casefold()
    return any(h==d.casefold() or h.endswith("."+d.casefold()) for d in allowed)

def evaluate(url, policy, resolved_ip=None):
    try:
        p=urlsplit(url)
    except Exception:
        return {"ok":False,"reasons":["invalid_url"]}
    reasons=[]
    if p.scheme not in policy.get("allowed_schemes",["https"]): reasons.append("scheme_not_allowed")
    if not p.hostname: reasons.append("missing_hostname")
    elif not domain_allowed(p.hostname,policy.get("allowed_domains",[])): reasons.append("domain_not_allowed")
    try:
        port=p.port or (443 if p.scheme=="https" else 80)
    except ValueError:
        reasons.append("invalid_port"); port=None
    if port is not None and port not in policy.get("allowed_ports",[443]): reasons.append("port_not_allowed")
    if policy.get("require_resolved_ip",True) and not resolved_ip: reasons.append("resolved_ip_required")
    if resolved_ip:
        try:
            ip=ipaddress.ip_address(resolved_ip)
            if policy.get("deny_private",True) and ip.is_private: reasons.append("private_ip_blocked")
            if policy.get("deny_loopback",True) and ip.is_loopback: reasons.append("loopback_ip_blocked")
            if policy.get("deny_link_local",True) and ip.is_link_local: reasons.append("link_local_ip_blocked")
            if policy.get("deny_multicast",True) and ip.is_multicast: reasons.append("multicast_ip_blocked")
            if ip.is_unspecified: reasons.append("unspecified_ip_blocked")
        except ValueError:
            reasons.append("invalid_resolved_ip")
    return {"ok":not reasons,"decision":"allow" if not reasons else "block","reasons":sorted(set(reasons)),"host":p.hostname,"port":port}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--url",required=True); ap.add_argument("--policy",required=True); ap.add_argument("--resolved-ip"); a=ap.parse_args()
    try:
        r=evaluate(a.url,load(a.policy),a.resolved_ip)
    except Exception as exc:
        print(json.dumps({"ok":False,"decision":"block","error":str(exc)})); return 2
    print(json.dumps(r,indent=2,sort_keys=True)); return 0 if r["ok"] else 3

if __name__=="__main__":
    raise SystemExit(main())
