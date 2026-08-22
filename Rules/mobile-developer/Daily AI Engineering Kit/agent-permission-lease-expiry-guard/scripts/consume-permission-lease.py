#!/usr/bin/env python3
import argparse,json
from pathlib import Path

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--lease',required=True); ap.add_argument('--out'); a=ap.parse_args(); p=Path(a.lease); l=json.loads(p.read_text(encoding='utf-8'))
    if l.get('status')!='active': raise SystemExit('lease is not active')
    if l.get('use_count',0)>=l.get('max_uses',0): raise SystemExit('lease use budget exhausted')
    l['use_count']=l.get('use_count',0)+1
    if l['use_count']>=l['max_uses']: l['status']='consumed'
    out=Path(a.out) if a.out else p; out.write_text(json.dumps(l,indent=2,sort_keys=True)+'\n',encoding='utf-8'); print(json.dumps({'status':l['status'],'use_count':l['use_count']}))
if __name__=='__main__': main()
