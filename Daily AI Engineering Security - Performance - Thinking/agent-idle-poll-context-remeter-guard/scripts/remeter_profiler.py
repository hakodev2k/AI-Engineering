#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

def load_jsonl(path):
    rows=[]
    for n,line in enumerate(Path(path).read_text(encoding='utf-8').splitlines(),1):
        if not line.strip(): continue
        try: row=json.loads(line)
        except Exception as e: raise ValueError(f'line {n}: {e}')
        for k in ('event','input_tokens','cached_tokens','latency_ms'):
            if k not in row: raise ValueError(f'line {n}: missing {k}')
        rows.append(row)
    return rows

def percentile(values,p):
    if not values: return 0.0
    s=sorted(values); pos=(len(s)-1)*p; lo=int(pos); hi=min(lo+1,len(s)-1); f=pos-lo
    return s[lo]*(1-f)+s[hi]*f

def profile(rows,policy):
    waits=set(policy.get('wait_events',['wait','wait_agent','list_agents','status']))
    total_input=sum(max(0,int(r['input_tokens'])) for r in rows)
    total_cached=sum(max(0,int(r['cached_tokens'])) for r in rows)
    wait_rows=[r for r in rows if r['event'] in waits]
    no_change=[r for r in wait_rows if str(r.get('result','')).lower() in ('timed_out','no_change','running','unchanged','')]
    seen=set(); duplicates=0
    for r in rows:
        h=r.get('tool_output_hash')
        if not h and 'tool_output' in r: h=hashlib.sha256(str(r['tool_output']).encode()).hexdigest()
        if h:
            if h in seen: duplicates+=1
            seen.add(h)
    consecutive=0; max_consecutive=0
    no_change_ids={id(r) for r in no_change}
    for r in rows:
        if id(r) in no_change_ids:
            consecutive+=1; max_consecutive=max(max_consecutive,consecutive)
        else: consecutive=0
    wait_cached=sum(max(0,int(r['cached_tokens'])) for r in wait_rows)
    no_change_cached=sum(max(0,int(r['cached_tokens'])) for r in no_change)
    violations=[]
    if len(wait_rows)>int(policy.get('max_model_visible_polls_per_task',40)): violations.append('poll_budget_exceeded')
    if max_consecutive>int(policy.get('max_consecutive_no_change_polls',5)): violations.append('consecutive_no_change_exceeded')
    cap=int(policy.get('max_cached_tokens_per_no_change_poll',120000))
    if any(int(r['cached_tokens'])>cap for r in no_change): violations.append('no_change_cached_token_cap_exceeded')
    useful=max(1,len(rows)-len(no_change))
    return {'rows':len(rows),'total_input_tokens':total_input,'total_cached_tokens':total_cached,
      'cache_read_ratio':(total_cached/total_input if total_input else 0.0),'wait_turns':len(wait_rows),
      'no_change_wait_turns':len(no_change),'wait_turn_ratio':(len(wait_rows)/len(rows) if rows else 0.0),
      'wait_cached_tokens':wait_cached,'no_change_cached_tokens':no_change_cached,
      'tokens_per_useful_state_change':total_input/useful,'duplicate_tool_outputs':duplicates,
      'max_consecutive_no_change':max_consecutive,'p50_latency_ms':percentile([float(r['latency_ms']) for r in rows],0.5),
      'p95_latency_ms':percentile([float(r['latency_ms']) for r in rows],0.95),'violations':violations,'ok':not violations}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('trace'); ap.add_argument('--policy',required=True); a=ap.parse_args()
    try:
        result=profile(load_jsonl(a.trace),json.loads(Path(a.policy).read_text(encoding='utf-8')))
        print(json.dumps(result,indent=2,sort_keys=True)); return 0 if result['ok'] else 3
    except Exception as e:
        print(str(e),file=sys.stderr); return 2
if __name__=='__main__': raise SystemExit(main())
