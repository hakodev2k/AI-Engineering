#!/usr/bin/env python3
import argparse,json,re,sys
from pathlib import Path

def load(p):
    with open(p,encoding='utf-8') as f:return json.load(f)

def main():
    ap=argparse.ArgumentParser(description='Find non-transactional side effects near explicit transaction/retry boundaries.')
    ap.add_argument('--root',default='.')
    ap.add_argument('--policy',default='config/policy.json')
    ap.add_argument('--output',default='transaction-side-effect-findings.json')
    a=ap.parse_args(); root=Path(a.root).resolve(); policy=load(a.policy)
    findings=[]
    for p in root.rglob('*'):
        if not p.is_file() or p.suffix not in policy['scanExtensions'] or any(x in p.parts for x in ('.git','bin','obj','node_modules')): continue
        try: lines=p.read_text(encoding='utf-8',errors='replace').splitlines()
        except OSError: continue
        tx=[i for i,l in enumerate(lines) if any(x in l for x in policy['transactionPatterns'])]
        if not tx: continue
        for i,l in enumerate(lines):
            effect=next((x for x in policy['sideEffectPatterns'] if x in l),None)
            if not effect: continue
            nearest=min(tx,key=lambda n:abs(n-i))
            if abs(nearest-i)>policy['maxContextLines']: continue
            lo=max(0,min(nearest,i)-12); hi=min(len(lines),max(nearest,i)+13)
            context='\n'.join(lines[lo:hi])
            safe=any(x in context for x in policy['safePatterns'])
            findings.append({'file':str(p.relative_to(root)),'line':i+1,'transaction_line':nearest+1,'side_effect':effect,'severity':'review' if safe else 'high','evidence':l.strip(),'safe_pattern_nearby':safe})
    out={'status':'fail' if any(f['severity']=='high' for f in findings) else 'pass','findings':findings}
    Path(a.output).write_text(json.dumps(out,indent=2),encoding='utf-8')
    print(json.dumps({'status':out['status'],'count':len(findings),'output':a.output}))
    return 2 if out['status']=='fail' and policy.get('failOnHigh',True) else 0
if __name__=='__main__':sys.exit(main())