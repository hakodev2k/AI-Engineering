#!/usr/bin/env python3
import argparse, ipaddress, json, socket, sys, time
from pathlib import Path

def main():
 p=argparse.ArgumentParser(); p.add_argument('--policy',default='config/policy.json'); p.add_argument('--output',default='dns-evidence.json'); p.add_argument('hosts',nargs='*'); a=p.parse_args()
 try: policy=json.loads(Path(a.policy).read_text(encoding='utf-8'))
 except Exception as e: print(f'policy error: {e}',file=sys.stderr); return 2
 hosts=a.hosts or policy.get('required_hosts',[])
 if not hosts: print('no hosts supplied',file=sys.stderr); return 2
 forbidden=[ipaddress.ip_network(x) for x in policy.get('forbidden_ip_ranges',[])]
 evidence={'status':'verified','hosts':[],'errors':[],'generated_at_epoch':int(time.time())}
 for host in hosts:
  started=time.monotonic(); addresses=[]; err=None
  for attempt in range(policy.get('max_retries',2)+1):
   try:
    addresses=sorted({x[4][0] for x in socket.getaddrinfo(host,None,type=socket.SOCK_STREAM)})
    break
   except socket.gaierror as e:
    err=str(e)
    if attempt < policy.get('max_retries',2): time.sleep(min(.25*(2**attempt),1))
  blocked=[]
  for s in addresses:
   try:
    ip=ipaddress.ip_address(s)
    if any(ip in n for n in forbidden): blocked.append(s)
   except ValueError: blocked.append(s)
  elapsed=round(time.monotonic()-started,3)
  ok=bool(addresses) and not blocked and len(addresses)<=policy.get('max_addresses_per_host',16) and len(addresses)>=policy.get('min_distinct_addresses',1) and elapsed<=policy.get('max_resolution_seconds',5)
  evidence['hosts'].append({'host':host,'addresses':addresses,'blocked_addresses':blocked,'seconds':elapsed,'ok':ok,'error':err if not addresses else None})
  if not ok: evidence['status']='failed'; evidence['errors'].append(host)
 Path(a.output).write_text(json.dumps(evidence,indent=2)+'\n',encoding='utf-8')
 print(json.dumps(evidence,indent=2)); return 0 if evidence['status']=='verified' else 1
if __name__=='__main__': raise SystemExit(main())
