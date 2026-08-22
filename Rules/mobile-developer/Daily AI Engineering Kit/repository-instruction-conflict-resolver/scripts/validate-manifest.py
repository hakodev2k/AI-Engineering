#!/usr/bin/env python3
import json, re, sys
from pathlib import Path

SHA=re.compile(r'^[0-9a-f]{64}$')

def fail(msg):
    print(f'ERROR: {msg}', file=sys.stderr); raise SystemExit(2)

def main():
    if len(sys.argv)!=2: fail('usage: validate-manifest.py <manifest.json>')
    try: data=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
    except Exception as e: fail(str(e))
    for k in ('task','targets','sources','statements'):
        if k not in data: fail(f'missing {k}')
    if not isinstance(data['targets'],list) or not data['targets']: fail('targets must be non-empty list')
    sids=set()
    for s in data['sources']:
        for k in ('id','path','source_type','authority','scope','sha256'):
            if k not in s: fail(f'source missing {k}')
        if s['id'] in sids: fail(f'duplicate source id {s["id"]}')
        sids.add(s['id'])
        if not SHA.match(str(s['sha256'])): fail(f'invalid sha256 for {s["id"]}')
    ids=set()
    for st in data['statements']:
        for k in ('id','source_id','subject','action','modality','scope','text'):
            if k not in st: fail(f'statement missing {k}')
        if st['id'] in ids: fail(f'duplicate statement id {st["id"]}')
        ids.add(st['id'])
        if st['source_id'] not in sids: fail(f'unknown source {st["source_id"]}')
        if st['modality'] not in ('must','must-not','should'): fail(f'invalid modality {st["id"]}')
    print(json.dumps({'status':'valid','sources':len(sids),'statements':len(ids)}))

if __name__=='__main__': main()
