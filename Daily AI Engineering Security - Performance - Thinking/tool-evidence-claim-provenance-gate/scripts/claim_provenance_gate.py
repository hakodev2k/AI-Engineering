#!/usr/bin/env python3
"""Validate structured externally grounded claims against a successful evidence ledger."""
import argparse, datetime as dt, json, pathlib, sys

def parse_time(value):
    if not value: return None
    try:
        return dt.datetime.fromisoformat(value.replace('Z','+00:00'))
    except ValueError:
        return None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('claims'); ap.add_argument('evidence')
    ap.add_argument('--max-live-age-sec', type=int, default=300)
    args = ap.parse_args()
    if args.max_live_age_sec < 0:
        print('invalid freshness', file=sys.stderr); return 2
    try:
        claims = json.loads(pathlib.Path(args.claims).read_text(encoding='utf-8'))
        evidence = json.loads(pathlib.Path(args.evidence).read_text(encoding='utf-8'))
    except Exception as e:
        print(f'invalid JSON: {e}', file=sys.stderr); return 2
    if not isinstance(claims, list) or not isinstance(evidence, list):
        print('both files must contain JSON arrays', file=sys.stderr); return 2
    ledger = {str(x.get('id')): x for x in evidence if isinstance(x,dict) and x.get('id') is not None}
    errors=[]; checked=[]; now=dt.datetime.now(dt.timezone.utc)
    for i,c in enumerate(claims):
        if not isinstance(c,dict): errors.append(f'claim {i}: invalid object'); continue
        cid=str(c.get('id',i)); kind=c.get('kind','knowledge'); ids=[str(x) for x in c.get('evidence_ids',[])]
        if kind in {'retrieved','live'} and not ids:
            errors.append(f'{cid}: evidence required')
        for eid in ids:
            e=ledger.get(eid)
            if not e: errors.append(f'{cid}: missing evidence {eid}'); continue
            if e.get('success') is not True: errors.append(f'{cid}: evidence {eid} not successful')
            expected=c.get('source_type')
            if expected and e.get('source_type') != expected: errors.append(f'{cid}: source mismatch for {eid}')
            if kind=='live':
                t=parse_time(e.get('timestamp'))
                if t is None: errors.append(f'{cid}: live evidence {eid} lacks valid timestamp')
                elif (now-t).total_seconds() > args.max_live_age_sec: errors.append(f'{cid}: live evidence {eid} is stale')
        checked.append({'claim_id':cid,'kind':kind,'evidence_ids':ids})
    print(json.dumps({'status':'BLOCK' if errors else 'PASS','errors':errors,'checked':checked}, indent=2))
    return 3 if errors else 0

if __name__ == '__main__':
    raise SystemExit(main())
