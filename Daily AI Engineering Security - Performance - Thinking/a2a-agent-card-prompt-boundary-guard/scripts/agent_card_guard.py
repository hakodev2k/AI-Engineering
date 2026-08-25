#!/usr/bin/env python3
import argparse, ipaddress, json, re, sys
from pathlib import Path
from urllib.parse import urlparse

PATTERNS = [
    re.compile(r"\b(ignore|disregard)\b.{0,40}\b(previous|prior|system|developer)\b", re.I),
    re.compile(r"\b(system|developer)\s+(message|instruction|override)\b", re.I),
    re.compile(r"\b(do not|never)\s+(follow|obey)\b.{0,40}\b(user|previous|prior)\b", re.I),
]
TEXT_KEYS = {"name", "description"}
URL_KEYS = {"url"}

def walk(obj, path="$"):
    if isinstance(obj, dict):
        for k, v in obj.items():
            p = f"{path}.{k}"
            yield k, v, p
            yield from walk(v, p)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from walk(v, f"{path}[{i}]")

def host_risk(url):
    u = urlparse(url)
    if u.scheme not in {"https", "http"} or not u.hostname:
        return "invalid-or-unsupported-url"
    h = u.hostname.rstrip(".").lower()
    if h == "localhost" or h.endswith(".localhost"):
        return "loopback-host"
    try:
        ip = ipaddress.ip_address(h)
    except ValueError:
        return None
    if ip.is_loopback or ip.is_link_local or ip.is_private or ip.is_reserved or ip.is_unspecified:
        return "non-public-ip"
    return None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("card")
    ap.add_argument("--max-text-chars", type=int, default=4096)
    ap.add_argument("--allow-private-hosts", action="store_true")
    a = ap.parse_args()
    if a.max_text_chars < 128:
        print(json.dumps({"error":"max-text-chars must be >=128"})); return 64
    try:
        raw = Path(a.card).read_text(encoding="utf-8")
        card = json.loads(raw)
    except (OSError, json.JSONDecodeError) as e:
        print(json.dumps({"accepted":False,"error":str(e)})); return 64
    if not isinstance(card, dict):
        print(json.dumps({"accepted":False,"error":"Agent Card root must be object"})); return 64
    findings=[]
    for key, val, path in walk(card):
        if key in TEXT_KEYS and isinstance(val, str):
            if len(val) > a.max_text_chars:
                findings.append({"path":path,"kind":"text-too-large","chars":len(val)})
            if any(ord(c) < 32 and c not in "\n\r\t" for c in val):
                findings.append({"path":path,"kind":"control-character"})
            for pat in PATTERNS:
                if pat.search(val):
                    findings.append({"path":path,"kind":"instruction-like-prose"}); break
        if key in URL_KEYS and isinstance(val, str):
            risk=host_risk(val)
            if risk and not (a.allow_private_hosts and risk in {"loopback-host","non-public-ip"}):
                findings.append({"path":path,"kind":risk})
    report={"accepted":not findings,"finding_count":len(findings),"findings":findings}
    print(json.dumps(report, indent=2, sort_keys=True))
    return 0 if not findings else 2

if __name__ == "__main__":
    sys.exit(main())
