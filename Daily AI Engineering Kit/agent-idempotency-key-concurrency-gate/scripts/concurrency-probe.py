#!/usr/bin/env python3
import argparse, concurrent.futures, hashlib, json, sys, urllib.request, urllib.error

def call(url,key,body,timeout):
 req=urllib.request.Request(url,data=body,method='POST',headers={'Content-Type':'application/json','Idempotency-Key':key})
 try:
  with urllib.request.urlopen(req,timeout=timeout) as r: return {'status':r.status,'body':r.read().decode(errors='replace')}
 except urllib.error.HTTPError as e: return {'status':e.code,'body':e.read().decode(errors='replace')}
 except Exception as e: return {'status':0,'error':type(e).__name__+': '+str(e)}

def main():
 p=argparse.ArgumentParser(); p.add_argument('url'); p.add_argument('--key',required=True); p.add_argument('--body',default='{}'); p.add_argument('--workers',type=int,default=8); p.add_argument('--timeout',type=float,default=10); p.add_argument('--output',default='concurrency-probe.json'); a=p.parse_args()
 if a.workers<2 or a.workers>50: print('workers must be 2..50',file=sys.stderr); return 2
 body=a.body.encode()
 with concurrent.futures.ThreadPoolExecutor(max_workers=a.workers) as ex: results=list(ex.map(lambda _:call(a.url,a.key,body,a.timeout),range(a.workers)))
 signatures={(r.get('status'),hashlib.sha256(r.get('body','').encode()).hexdigest()) for r in results if r.get('status')}
 out={'requests':a.workers,'key':a.key,'results':results,'responseVariants':len(signatures),'consistent':len(signatures)==1 and all(r.get('status') for r in results)}
 open(a.output,'w',encoding='utf-8').write(json.dumps(out,indent=2)); print(json.dumps(out,indent=2)); return 0 if out['consistent'] else 1
if __name__=='__main__': sys.exit(main())
