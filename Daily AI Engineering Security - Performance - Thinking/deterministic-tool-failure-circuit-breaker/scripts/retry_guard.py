#!/usr/bin/env python3
import argparse, hashlib, json, pathlib, sys

DETERMINISTIC={'validation','authorization','permission','not_found','unsupported','policy','deterministic'}
TRANSIENT={'timeout','rate_limit','network','stream_closed','transient','server_5xx'}

def canon(v):
    return json.dumps(v, sort_keys=True, separators=(',',':'), ensure_ascii=False)

def main():
    p=argparse.ArgumentParser(description='Deterministic gate for agent tool retries.')
    p.add_argument('incident')
    a=p.parse_args()
    try:
        d=json.loads(pathlib.Path(a.incident).read_text(encoding='utf-8'))
    except Exception as e:
        print(f'invalid incident: {e}', file=sys.stderr); return 2
    required=['tool','arguments','error_class','error_fingerprint','attempts']
    miss=[k for k in required if k not in d]
    if miss:
        print(json.dumps({'status':'INVALID','missing':miss})); return 2
    try: attempts=int(d['attempts'])
    except Exception:
        print('attempts must be integer', file=sys.stderr); return 2
    cls=str(d['error_class']).lower()
    key_src=f"{d['tool']}|{canon(d['arguments'])}|{cls}|{d['error_fingerprint']}"
    incident_id=hashlib.sha256(key_src.encode()).hexdigest()[:16]
    side_effect=bool(d.get('side_effecting',False)); reconciled=bool(d.get('outcome_reconciled',False))
    changed=bool(d.get('changed_since_failure',False))
    if side_effect and not reconciled and cls not in DETERMINISTIC:
        out={'status':'BLOCK','incident_id':incident_id,'reason':'unknown side effect requires reconciliation'}; print(json.dumps(out,indent=2)); return 3
    if cls in DETERMINISTIC and attempts >= 2 and not changed:
        out={'status':'BLOCK','incident_id':incident_id,'reason':'identical deterministic retry budget exhausted'}; print(json.dumps(out,indent=2)); return 3
    if cls in TRANSIENT and attempts >= 3:
        out={'status':'BLOCK','incident_id':incident_id,'reason':'transient retry budget exhausted'}; print(json.dumps(out,indent=2)); return 3
    if cls not in DETERMINISTIC|TRANSIENT and attempts >= 2 and not changed:
        out={'status':'BLOCK','incident_id':incident_id,'reason':'unclassified repeated failure requires new evidence'}; print(json.dumps(out,indent=2)); return 3
    out={'status':'ALLOW_RETRY','incident_id':incident_id,'attempts':attempts,'changed':changed}; print(json.dumps(out,indent=2)); return 0

if __name__=='__main__':
    raise SystemExit(main())
