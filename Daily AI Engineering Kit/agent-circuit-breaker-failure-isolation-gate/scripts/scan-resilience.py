#!/usr/bin/env python3
import argparse,json,re,sys
from pathlib import Path

def main():
 p=argparse.ArgumentParser(); p.add_argument('--root',default='.'); p.add_argument('--policy',default='config/gate-policy.json'); p.add_argument('--output',default='circuit-breaker-findings.json'); a=p.parse_args()
 root=Path(a.root).resolve(); policy_path=Path(a.policy); policy_path=policy_path if policy_path.is_absolute() else root/policy_path
 if not root.is_dir() or not policy_path.is_file(): print('invalid root or policy',file=sys.stderr); return 2
 policy=json.loads(policy_path.read_text(encoding='utf-8')); exts=set(policy['scan']['extensions']); excluded=set(policy['scan']['exclude']); findings=[]
 call=re.compile(r'(HttpClient|fetch\s*\(|requests\.(get|post|put|delete)|axios\.|RestClient|grpc)',re.I); retry=re.compile(r'(retry|WaitAndRetry|RetryPolicy)',re.I); timeout=re.compile(r'(timeout|CancelAfter|CancellationToken)',re.I); breaker=re.compile(r'(CircuitBreaker|circuit[_ -]?breaker|BrokenCircuit|half[_ -]?open)',re.I)
 for f in root.rglob('*'):
  if not f.is_file() or f.suffix.lower() not in exts or any(x in f.parts for x in excluded): continue
  try: lines=f.read_text(encoding='utf-8',errors='ignore').splitlines()
  except OSError: continue
  text='\n'.join(lines)
  has_breaker=bool(breaker.search(text))
  for i,line in enumerate(lines,1):
   if call.search(line):
    window='\n'.join(lines[max(0,i-8):min(len(lines),i+8)])
    if not timeout.search(window): findings.append({'id':f'timeout-{len(findings)+1}','severity':'high','file':str(f.relative_to(root)),'line':i,'finding':'External call has no nearby timeout/cancellation evidence','evidence':line.strip()[:300],'recommended_action':'Add an explicit bounded timeout/cancellation policy and verify timeout behavior.'})
   if retry.search(line):
    window='\n'.join(lines[max(0,i-12):min(len(lines),i+12)])
    if not re.search(r'(max|count|attempt|retrycount|RetryAsync\s*\(\s*\d)',window,re.I): findings.append({'id':f'retry-{len(findings)+1}','severity':'high','file':str(f.relative_to(root)),'line':i,'finding':'Retry behavior has no obvious bounded-attempt evidence','evidence':line.strip()[:300],'recommended_action':'Bound retries and separate retryable from terminal failures.'})
  if has_breaker: findings.append({'id':f'breaker-{len(findings)+1}','severity':'info','file':str(f.relative_to(root)),'line':1,'finding':'Circuit-breaker evidence detected','evidence':'Circuit-breaker related symbol present in file','recommended_action':'Verify thresholds, half-open probes, telemetry, and fallback semantics.'})
 blocking=sum(x['severity'] in ('high','critical') for x in findings); result={'status':'fail' if blocking else 'pass','findings':findings,'verification':{'scanner_exit_code':1 if blocking else 0,'blocking_findings':blocking}}
 out=Path(a.output); out=out if out.is_absolute() else root/out; out.write_text(json.dumps(result,indent=2),encoding='utf-8'); print(json.dumps({'status':result['status'],'findings':len(findings),'blocking':blocking,'output':str(out)})); return 1 if blocking else 0
if __name__=='__main__': sys.exit(main())
