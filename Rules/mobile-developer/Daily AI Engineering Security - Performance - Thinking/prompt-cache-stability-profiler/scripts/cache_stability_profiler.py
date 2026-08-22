#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

SECRET_KEYS={"authorization","access_token","refresh_token","api_key","client_secret"}

def load(path):
    try: data=json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as e:
        print(json.dumps({"status":"error","reason":str(e)})); sys.exit(1)
    if not isinstance(data,dict):
        print(json.dumps({"status":"error","reason":"request dump must be JSON object"})); sys.exit(1)
    return data

def has_secret(obj):
    if isinstance(obj,dict):
        for k,v in obj.items():
            if k.lower() in SECRET_KEYS and v not in (None,"","<redacted>"): return True
            if has_secret(v): return True
    elif isinstance(obj,list):
        return any(has_secret(v) for v in obj)
    return False

def canonical(v):
    return json.dumps(v,ensure_ascii=False,separators=(",",":"),sort_keys=False).encode("utf-8")

def digest(v): return hashlib.sha256(canonical(v)).hexdigest()

def first_diff(a,b,path="$"
):
    if type(a) is not type(b): return path
    if isinstance(a,dict):
        if list(a.keys()) != list(b.keys()): return path+".<key-order>"
        for k in a:
            d=first_diff(a[k],b[k],path+"."+str(k))
            if d: return d
        return None
    if isinstance(a,list):
        if len(a)!=len(b): return path+".<length>"
        for i,(x,y) in enumerate(zip(a,b)):
            d=first_diff(x,y,f"{path}[{i}]")
            if d: return d
        return None
    return None if a==b else path

def main():
    p=argparse.ArgumentParser(description="Compare cache-critical request segments without exposing content")
    sub=p.add_subparsers(dest="cmd",required=True)
    c=sub.add_parser("compare")
    c.add_argument("--baseline",required=True); c.add_argument("--current",required=True)
    c.add_argument("--static",nargs="+",required=True,help="top-level keys expected to remain stable")
    c.add_argument("--fail-on-drift",action="store_true")
    args=p.parse_args()
    base,cur=load(args.baseline),load(args.current)
    if has_secret(base) or has_secret(cur):
        print(json.dumps({"status":"error","reason":"unredacted secret-like field detected"})); return 1
    report={"status":"stable","segments":{}}
    drift=False
    for key in args.static:
        if key not in base or key not in cur:
            report["segments"][key]={"stable":False,"reason":"missing_segment"}; drift=True; continue
        bh,ch=digest(base[key]),digest(cur[key])
        item={"stable":bh==ch,"baseline_sha256":bh,"current_sha256":ch}
        if bh!=ch:
            item["first_divergence"]=first_diff(base[key],cur[key],"$."+key); drift=True
        report["segments"][key]=item
    if drift: report["status"]="drift"
    print(json.dumps(report,sort_keys=True))
    return 2 if drift and args.fail_on_drift else 0

if __name__=="__main__": sys.exit(main())
