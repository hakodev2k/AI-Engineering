#!/usr/bin/env python3
"""Analyze prompt-cache churn from normalized JSONL call telemetry."""
import json, sys
from pathlib import Path

REQ=('ts','input_tokens','cache_read_tokens','cache_write_tokens')
def load_json(p):
 try: return json.loads(Path(p).read_text(encoding='utf-8'))
 except (OSError,json.JSONDecodeError) as e: raise ValueError(f'{p}: {e}')
def load_trace(p):
 rows=[]
 try:
  for n,line in enumerate(Path(p).read_text(encoding='utf-8').splitlines(),1):
   if not line.strip(): continue
   try: r=json.loads(line)
   except json.JSONDecodeError as e: raise ValueError(f'{p}:{n}: {e}')
   if not all(k in r for k in REQ): raise ValueError(f'{p}:{n}: missing required fields')
   if any(not isinstance(r[k],(int,float)) or r[k]<0 for k in REQ): raise ValueError(f'{p}:{n}: numeric fields must be >=0')
   rows.append(r)
 except OSError as e: raise ValueError(f'{p}: {e}')
 if not rows: raise ValueError('empty trace')
 return rows

def analyze(rows):
 total_input=sum(r['input_tokens'] for r in rows); reads=sum(r['cache_read_tokens'] for r in rows); writes=sum(r['cache_write_tokens'] for r in rows)
 resets=0; redundant=0; prev=None; gaps=[]
 for r in rows:
  if prev is not None:
   gap=r['ts']-prev['ts']; gaps.append(gap)
   stable=(r.get('prefix_fingerprint') and r.get('prefix_fingerprint')==prev.get('prefix_fingerprint'))
   if stable and r['cache_write_tokens']>0 and prev['cache_read_tokens']>0:
    resets+=1; redundant+=r['cache_write_tokens']
  prev=r
 denom=reads+writes+total_input
 return {'calls':len(rows),'input_tokens':total_input,'cache_read_tokens':reads,'cache_write_tokens':writes,'weighted_cache_read_ratio':(reads/denom if denom else 0.0),'redundant_write_tokens':redundant,'redundant_write_ratio':(redundant/writes if writes else 0.0),'stable_prefix_resets':resets,'max_inter_call_gap_s':max(gaps) if gaps else 0}

def main(a):
 if len(a)!=3: print(f'usage: {a[0]} <thresholds.json> <trace.jsonl>',file=sys.stderr); return 1
 try: cfg=load_json(a[1]); rows=load_trace(a[2]); m=analyze(rows)
 except ValueError as e: print('ERROR:',e,file=sys.stderr); return 1
 print(json.dumps(m,indent=2,sort_keys=True))
 bad=(m['redundant_write_ratio']>float(cfg.get('max_redundant_write_ratio',0.25)) or m['stable_prefix_resets']>int(cfg.get('max_stable_prefix_resets',1)))
 print('CHURN' if bad else 'PASS'); return 3 if bad else 0
if __name__=='__main__': sys.exit(main(sys.argv))
