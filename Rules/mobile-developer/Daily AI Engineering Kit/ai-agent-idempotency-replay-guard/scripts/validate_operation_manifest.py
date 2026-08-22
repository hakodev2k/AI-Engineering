#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path


def canon(obj, volatile):
    if isinstance(obj, dict):
        return {k: canon(v, volatile) for k, v in sorted(obj.items()) if k not in volatile}
    if isinstance(obj, list): return [canon(v, volatile) for v in obj]
    return obj


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--manifest', required=True)
    ap.add_argument('--policy', required=True)
    a = ap.parse_args()
    m = json.loads(Path(a.manifest).read_text(encoding='utf-8'))
    p = json.loads(Path(a.policy).read_text(encoding='utf-8'))
    errors=[]
    for f in ['operation_key','action','target_identity','payload','payload_fingerprint','risk_category','provider','verification','retry']:
        if f not in m: errors.append(f'missing:{f}')
    if errors:
        print(json.dumps({'status':'blocked','errors':errors})); return 2
    volatile=set(p.get('volatile_payload_fields',[]))
    raw=json.dumps(canon(m['payload'],volatile),sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
    fp=hashlib.sha256(raw).hexdigest()
    if fp != m['payload_fingerprint']: errors.append('payload_fingerprint_mismatch')
    if m['retry'].get('max_retries',0) > p.get('max_mutation_retries',1): errors.append('retry_budget_exceeds_policy')
    if not m['provider'].get('native_idempotency_supported',False) and m['risk_category'] in p.get('high_risk_categories',[]):
        if not m['provider'].get('lookup_strategy'): errors.append('high_risk_requires_lookup_strategy')
    if m['verification'].get('evidence_required',True) and not m['verification'].get('strategy'): errors.append('verification_strategy_required')
    print(json.dumps({'status':'valid' if not errors else 'blocked','errors':errors,'computed_fingerprint':fp},indent=2))
    return 0 if not errors else 2

if __name__=='__main__': sys.exit(main())
