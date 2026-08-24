#!/usr/bin/env python3
"""Fail closed when a turn is unsafe for context compaction."""
import argparse, json, sys
from pathlib import Path

def check(snapshot, policy):
    reasons=[]
    if not snapshot.get('turn_id'): reasons.append('missing_turn_id')
    if policy.get('require_goal_id') and not snapshot.get('active_goal_id'): reasons.append('missing_active_goal_id')
    if snapshot.get('turn_state') not in policy['allowed_terminal_states']: reasons.append('turn_not_terminal')
    unresolved=[]
    for t in snapshot.get('tools',[]):
        if not t.get('invocation_id'): reasons.append('tool_missing_invocation_id')
        if policy.get('require_tool_correlation_id') and not t.get('correlation_id'): reasons.append('tool_missing_correlation_id')
        if t.get('state') not in policy['resolved_tool_states']:
            unresolved.append(t.get('invocation_id','<unknown>'))
    if unresolved: reasons.append('unresolved_tools')
    return {'safe_to_compact':not reasons,'reasons':sorted(set(reasons)),'unresolved_invocations':unresolved,'turn_id':snapshot.get('turn_id'),'active_goal_id':snapshot.get('active_goal_id')}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('snapshot'); ap.add_argument('--policy',required=True); ap.add_argument('--output')
    a=ap.parse_args()
    try:
        snap=json.loads(Path(a.snapshot).read_text(encoding='utf-8')); pol=json.loads(Path(a.policy).read_text(encoding='utf-8')); r=check(snap,pol)
    except (OSError,json.JSONDecodeError,KeyError) as e:
        print(f'error: {e}',file=sys.stderr); return 2
    text=json.dumps(r,indent=2,sort_keys=True)
    if a.output: Path(a.output).write_text(text+'\n',encoding='utf-8')
    else: print(text)
    return 0 if r['safe_to_compact'] else 3
if __name__=='__main__': raise SystemExit(main())
