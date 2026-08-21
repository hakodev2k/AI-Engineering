#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load(p): return json.loads(Path(p).read_text(encoding='utf-8'))

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--diff',required=True); ap.add_argument('--manifest',required=True); ap.add_argument('--policy',required=True); ap.add_argument('--review'); ap.add_argument('--output',required=True); a=ap.parse_args()
    try: d,m,p=load(a.diff),load(a.manifest),load(a.policy); r=load(a.review) if a.review else None
    except Exception as e: print(f'input error: {e}',file=sys.stderr); return 2
    reasons=[]; status='verified'
    if d.get('errors'): status='blocked'; reasons.extend(d['errors'])
    if p.get('block_head_drift',True) and d.get('current_head')!=d.get('baseline_head'): status='blocked'; reasons.append('head-drift')
    if p.get('block_unowned_agent_changes',True) and d.get('unowned_paths'): status='blocked'; reasons.append('unowned-agent-changes')
    touched=d.get('preexisting_touched_paths',[])
    if touched and p.get('block_touched_preexisting_without_review',True):
        if not r: status='review-required' if status!='blocked' else status; reasons.append('preexisting-touch-review-required')
        else:
            if r.get('reviewer')==r.get('implementation_owner'): status='blocked'; reasons.append('self-review-not-allowed')
            if r.get('task_id')!=d.get('task_id') or r.get('baseline_fingerprint')!=d.get('baseline_fingerprint') or r.get('current_fingerprint')!=d.get('current_fingerprint') or r.get('owned_diff_fingerprint')!=d.get('owned_diff_fingerprint'): status='blocked'; reasons.append('stale-or-mismatched-review')
            if r.get('status')!='approved': status='blocked'; reasons.append('review-not-approved')
            missing=[x for x in touched if x not in r.get('approved_exceptions',[])]
            if missing: status='blocked'; reasons.append('preexisting-touch-not-approved:'+','.join(missing))
    result={'status':status,'task_id':d.get('task_id'),'baseline_fingerprint':d.get('baseline_fingerprint'),'current_fingerprint':d.get('current_fingerprint'),'owned_diff_fingerprint':d.get('owned_diff_fingerprint'),'owned_paths':d.get('owned_paths',[]),'unowned_paths':d.get('unowned_paths',[]),'preexisting_touched_paths':touched,'reasons':reasons}
    Path(a.output).write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8'); print(json.dumps(result))
    return 0 if status=='verified' else 4 if status=='review-required' else 5
if __name__=='__main__': raise SystemExit(main())
