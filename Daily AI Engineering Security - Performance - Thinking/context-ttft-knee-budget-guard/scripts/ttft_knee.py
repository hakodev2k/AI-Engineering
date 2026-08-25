#!/usr/bin/env python3
import argparse,json,math,sys
from collections import defaultdict
from pathlib import Path
REQ={'input_tokens','cached_input_tokens','ttft_ms','model','workload'}
def pct(v,q):
 v=sorted(v); p=(len(v)-1)*q; a=math.floor(p); b=math.ceil(p); return v[a] if a==b else v[a]*(b-p)+v[b]*(p-a)
def load(path):
 rows=[]
 with open(path,encoding='utf-8') as f:
  for n,line in enumerate(f,1):
   if not line.strip(): continue
   try:r=json.loads(line)
   except json.JSONDecodeError as e: raise ValueError(f'line {n}: invalid JSON') from e
   miss=REQ-r.keys()
   if miss: raise ValueError(f'line {n}: missing '+','.join(sorted(miss)))
   try:x={'input_tokens':int(r['input_tokens']),'cached_input_tokens':int(r['cached_input_tokens']),'ttft_ms':float(r['ttft_ms']),'model':str(r['model']),'workload':str(r['workload'])}
   except (TypeError,ValueError) as e: raise ValueError(f'line {n}: invalid types') from e
   if x['input_tokens']<=0 or x['cached_input_tokens']<0 or x['ttft_ms']<0 or x['cached_input_tokens']>x['input_tokens']: raise ValueError(f'line {n}: invalid values')
   rows.append(x)
 if not rows: raise ValueError('no telemetry rows')
 return rows
def analyze(rows,cfg):
 bs=int(cfg['bin_size_tokens']); minimum=int(cfg['minimum_samples_per_bin']); limit=float(cfg['max_p95_ttft_ms']); margin=float(cfg['safety_margin_ratio']); default=int(cfg['default_soft_budget_tokens']); grouped=defaultdict(list)
 for r in rows: grouped[(r['model'],r['workload'])].append(r)
 groups=[]
 for (model,workload),rs in sorted(grouped.items()):
  bins=defaultdict(list)
  for r in rs: bins[(r['input_tokens']//bs)*bs].append(r)
  curve=[]; knee=None
  for b,br in sorted(bins.items()):
   tt=[x['ttft_ms'] for x in br]; cr=[x['cached_input_tokens']/x['input_tokens'] for x in br]; point={'bin_start_tokens':b,'samples':len(br),'ttft_p50_ms':pct(tt,.5),'ttft_p95_ms':pct(tt,.95),'cache_ratio_p50':pct(cr,.5)}; curve.append(point)
   if knee is None and len(br)>=minimum and point['ttft_p95_ms']>limit:knee=b
  recommended=max(bs,int(knee*margin)) if knee is not None else default
  groups.append({'model':model,'workload':workload,'samples':len(rs),'curve':curve,'detected_knee_tokens':knee,'recommended_soft_budget_tokens':recommended,'requests_above_budget':sum(1 for r in rs if r['input_tokens']>recommended)})
 return {'groups':groups,'policy':{'max_p95_ttft_ms':limit,'safety_margin_ratio':margin},'note':'Detected knee is workload evidence, not proof that context size alone causes latency.'}
def gate(tokens,rep,model,workload):
 m=[g for g in rep['groups'] if g['model']==model and g['workload']==workload]
 if not m: raise ValueError('no matching model/workload group')
 b=m[0]['recommended_soft_budget_tokens']; return {'model':model,'workload':workload,'current_input_tokens':tokens,'soft_budget_tokens':b,'passed':tokens<=b}
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('telemetry'); ap.add_argument('--config',required=True); ap.add_argument('--output'); ap.add_argument('--gate-tokens',type=int); ap.add_argument('--model'); ap.add_argument('--workload'); a=ap.parse_args()
 try:
  cfg=json.loads(Path(a.config).read_text()); rep=analyze(load(a.telemetry),cfg); code=0
  if a.gate_tokens is not None:
   if not a.model or not a.workload: raise ValueError('--gate-tokens requires --model and --workload')
   rep['gate']=gate(a.gate_tokens,rep,a.model,a.workload); code=0 if rep['gate']['passed'] else 2
  text=json.dumps(rep,indent=2,sort_keys=True); Path(a.output).write_text(text+'\n') if a.output else print(text); return code
 except (OSError,ValueError,KeyError,json.JSONDecodeError) as e: print('error: '+str(e),file=sys.stderr); return 1
if __name__=='__main__': raise SystemExit(main())
