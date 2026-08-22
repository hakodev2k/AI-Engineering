#!/usr/bin/env python3
import argparse, hashlib, json, sys, time, urllib.error, urllib.request

def request(url, method, body, headers, timeout):
    req=urllib.request.Request(url,data=body,method=method,headers=headers)
    try:
        with urllib.request.urlopen(req,timeout=timeout) as r:
            data=r.read(); return r.status, dict(r.headers), data
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read()

def digest(data): return hashlib.sha256(data).hexdigest()
def main():
    p=argparse.ArgumentParser(description="Replay one non-destructive HTTP request with the same idempotency key.")
    p.add_argument("url"); p.add_argument("--method",default="POST",choices=["POST","PATCH","PUT"])
    p.add_argument("--body-file"); p.add_argument("--key",required=True); p.add_argument("--key-header",default="Idempotency-Key")
    p.add_argument("--authorization-env",default="REPLAY_AUTHORIZATION"); p.add_argument("--timeout",type=float,default=15); p.add_argument("--delay",type=float,default=.2)
    p.add_argument("--allow-production",action="store_true",help="Explicit operator acknowledgement; still does not infer environment safety.")
    a=p.parse_args()
    if not a.url.startswith(("http://localhost", "http://127.0.0.1", "https://localhost", "https://127.0.0.1")) and not a.allow_production:
        print("Refusing non-local target without --allow-production and human approval.",file=sys.stderr); return 4
    body=open(a.body_file,"rb").read() if a.body_file else b"{}"
    headers={"Content-Type":"application/json",a.key_header:a.key}
    import os
    auth=os.getenv(a.authorization_env)
    if auth: headers["Authorization"]=auth
    first=request(a.url,a.method,body,headers,a.timeout); time.sleep(a.delay); second=request(a.url,a.method,body,headers,a.timeout)
    result={"first":{"status":first[0],"body_sha256":digest(first[2])},"second":{"status":second[0],"body_sha256":digest(second[2])},"same_status":first[0]==second[0],"same_body":digest(first[2])==digest(second[2])}
    print(json.dumps(result,indent=2))
    return 0 if result["same_status"] else 5
if __name__=="__main__": raise SystemExit(main())
