#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path


def load_json(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))

def load_trace(path):
    rows=[]
    for n,line in enumerate(Path(path).read_text(encoding='utf-8').splitlines(),1):
        if not line.strip(): continue
        try: row=json.loads(line)
        except Exception as e: raise ValueError(f'line {n}: {e}')
        if 'tool' not in row or 'arguments' not in row:
            raise ValueError(f'line {n}: tool and arguments required')
        rows.append(row)
    return rows

def signature(row):
    payload=json.dumps({'tool':row['tool'],'arguments':row['arguments']},sort_keys=True,separators=(',',':'),ensure_ascii=False)
    return hashlib.sha256(payload.encode('utf-8')).hexdigest()

def analyze(rows, policy):
    if not rows:
        return {'decision':'continue','reason':'no_steps','metrics':{'steps':0}}
    repeat=1; max_repeat=1
    no_progress=0; max_no_progress=0
    scope_growth=0; max_scope_growth=0
    prev_sig=None; prev_key=None; prev_completed=None; prev_open=None
    for row in rows:
        sig=signature(row)
        if sig==prev_sig: repeat+=1
        else: repeat=1
        max_repeat=max(max_repeat,repeat)
        key=row.get('progress_key')
        completed=row.get('completed_items')
        open_items=row.get('open_items')
        progressed=False
        if prev_key is not None and key is not None and key!=prev_key: progressed=True
        if prev_completed is not None and isinstance(completed,int) and completed>prev_completed: progressed=True
        no_progress = 0 if progressed else no_progress+1
        max_no_progress=max(max_no_progress,no_progress)
        grew=False
        if isinstance(prev_open,int) and isinstance(open_items,int) and open_items>prev_open:
            if not (isinstance(prev_completed,int) and isinstance(completed,int) and completed>prev_completed): grew=True
        scope_growth = scope_growth+1 if grew else 0
        max_scope_growth=max(max_scope_growth,scope_growth)
        prev_sig=sig; prev_key=key; prev_completed=completed; prev_open=open_items
    reasons=[]
    if max_repeat>=int(policy['stop_repeated_identical']): reasons.append('repeated_identical_tool_call')
    if max_no_progress>=int(policy['stop_no_progress']): reasons.append('no_progress_streak')
    if max_scope_growth>=int(policy['stop_scope_growth_streak']): reasons.append('scope_growth_without_completion')
    decision='stop' if reasons else 'continue'
    if decision=='continue' and (max_repeat>=int(policy['warn_repeated_identical']) or max_no_progress>=int(policy['warn_no_progress'])):
        decision='warn'; reasons.append('change_hypothesis_or_action_required')
    return {'decision':decision,'reasons':reasons,'metrics':{'steps':len(rows),'max_identical_streak':max_repeat,'max_no_progress_streak':max_no_progress,'max_scope_growth_streak':max_scope_growth}}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--trace',required=True); ap.add_argument('--policy',required=True); a=ap.parse_args()
    try:
        out=analyze(load_trace(a.trace),load_json(a.policy)); print(json.dumps(out,indent=2,sort_keys=True)); return 3 if out['decision']=='stop' else (1 if out['decision']=='warn' else 0)
    except Exception as e:
        print(json.dumps({'error':str(e)}),file=sys.stderr); return 2
if __name__=='__main__': raise SystemExit(main())
