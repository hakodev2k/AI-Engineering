#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load(p): return json.loads(Path(p).read_text(encoding='utf-8'))

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--gate',required=True); ap.add_argument('--current',required=True); ap.add_argument('--manifest',required=True); ap.add_argument('--approval'); ap.add_argument('--output',required=True); a=ap.parse_args()
    try: g,c,m=load(a.gate),load(a.current),load(a.manifest); approval=load(a.approval) if a.approval else None
    except Exception as e: print(f'input error: {e}',file=sys.stderr); return 2
    reasons=[]; status='verified'
    if g.get('status')!='verified': status='blocked'; reasons.append('workspace-gate-not-verified')
    if c.get('status_fingerprint')!=g.get('current_fingerprint'): status='blocked'; reasons.append('post-gate-workspace-drift')
    if c.get('head')!=m.get('baseline_head'): status='blocked'; reasons.append('post-gate-head-drift')
    required=m.get('approval_actions',[])
    if required:
        if not approval: status='approval-required' if status!='blocked' else status; reasons.append('human-approval-required')
        else:
            if approval.get('task_id')!=m.get('task_id') or approval.get('owned_diff_fingerprint')!=g.get('owned_diff_fingerprint'): status='blocked'; reasons.append('stale-or-mismatched-approval')
            missing=[x for x in required if x not in approval.get('approved_actions',[])]
            if missing: status='blocked'; reasons.append('approval-missing-actions:'+','.join(missing))
    result={'status':status,'task_id':m.get('task_id'),'owned_diff_fingerprint':g.get('owned_diff_fingerprint'),'current_fingerprint':c.get('status_fingerprint'),'reasons':reasons}
    Path(a.output).write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8'); print(json.dumps(result))
    return 0 if status=='verified' else 4 if status=='approval-required' else 5
if __name__=='__main__': raise SystemExit(main())
