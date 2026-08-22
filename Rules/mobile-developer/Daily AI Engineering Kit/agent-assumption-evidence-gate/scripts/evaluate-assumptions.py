#!/usr/bin/env python3
import argparse, hashlib, json, sys
from datetime import datetime, timezone
from pathlib import Path

def load(p): return json.loads(Path(p).read_text(encoding='utf-8'))
def canon(o): return json.dumps(o,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
def parse_dt(v): return datetime.fromisoformat(v.replace('Z','+00:00')).astimezone(timezone.utc)

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('assumptions'); ap.add_argument('policy'); ap.add_argument('--output'); ap.add_argument('--now')
    a=ap.parse_args(); items=load(a.assumptions); policy=load(a.policy)
    if not isinstance(items,list): raise SystemExit('assumptions must be array')
    now=parse_dt(a.now) if a.now else datetime.now(timezone.utc)
    blocking=[]; warnings=[]; counts={k:0 for k in ['total','supported','proposed','contradicted','expired','waived']}
    high=set(policy.get('high_risk_levels',['high','critical']))
    for x in items:
        counts['total']+=1; st=x.get('status','proposed'); mid=x.get('materiality','medium'); ident=x.get('id','<missing>')
        if st in counts: counts[st]+=1
        try:
            if parse_dt(x['expires_at']) <= now and st not in ('contradicted','expired'):
                st='expired'; counts['expired']+=1; blocking.append(f'{ident}: evidence expired') if mid in high else warnings.append(f'{ident}: evidence expired')
        except Exception: blocking.append(f'{ident}: invalid expires_at')
        ev=x.get('evidence',[])
        if st=='supported' and policy.get('require_evidence_for_supported',True) and not any(e.get('supports') is True for e in ev): blocking.append(f'{ident}: supported without positive evidence')
        if st=='contradicted' and policy.get('allow_contradicted_assumption_usage',False) is False and x.get('used_by'): blocking.append(f'{ident}: contradicted assumption still used')
        if st=='proposed' and x.get('used_by'):
            (blocking if mid in high else warnings).append(f'{ident}: unresolved assumption is used')
        if st=='waived':
            if mid=='critical' and not policy.get('allow_waiver_for_critical',False): blocking.append(f'{ident}: critical waiver forbidden')
            if policy.get('require_decision_evidence_for_waiver',True) and not x.get('waiver',{}).get('evidence_reference'): blocking.append(f'{ident}: waiver lacks decision evidence')
    status='blocked' if blocking else ('review-required' if warnings else 'verified')
    result={'status':status,'checked_at':now.isoformat().replace('+00:00','Z'),'policy_fingerprint':hashlib.sha256(canon(policy)).hexdigest(),'assumption_fingerprint':hashlib.sha256(canon(items)).hexdigest(),'blocking':blocking,'warnings':warnings,'counts':counts}
    text=json.dumps(result,indent=2)
    if a.output: Path(a.output).write_text(text+'\n',encoding='utf-8')
    else: print(text)
    return 0 if status=='verified' else (2 if status=='review-required' else 3)
if __name__=='__main__': sys.exit(main())