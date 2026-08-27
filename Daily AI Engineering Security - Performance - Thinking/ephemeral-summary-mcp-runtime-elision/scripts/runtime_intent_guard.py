#!/usr/bin/env python3
import argparse, json
from pathlib import Path

def load(path):
    try:
        return json.loads(Path(path).read_text(encoding='utf-8'))
    except Exception as e:
        print(json.dumps({'ok': False, 'decision': 'block', 'reasons': [f'input_error:{e}']}))
        raise SystemExit(2)

def evaluate(event, policy):
    required=['feature','ephemeral','tools_required','effective_mcp_count','completion_action','pending_tool_calls']
    reasons=[f'missing:{k}' for k in required if k not in event]
    if reasons: return {'ok':False,'decision':'block','reasons':reasons}
    try:
        effective_mcp=int(event['effective_mcp_count']); pending=int(event['pending_tool_calls'])
    except (TypeError,ValueError):
        return {'ok':False,'decision':'block','reasons':['count_not_integer']}
    ephemeral=bool(event['ephemeral']); tools_required=bool(event['tools_required']); action=event['completion_action']
    if effective_mcp < 0 or pending < 0: reasons.append('negative_count')
    max_mcp=int(policy.get('max_effective_mcp_for_tool_free_ephemeral',0))
    if ephemeral and not tools_required and effective_mcp > max_mcp: reasons.append('tool_free_ephemeral_mcp_budget_exceeded')
    if ephemeral and not tools_required and effective_mcp != 0: reasons.append('tool_free_ephemeral_session_must_not_start_mcp')
    if ephemeral and action in policy.get('unsubscribe_only_actions',['unsubscribe']): reasons.append('unsubscribe_is_not_resource_disposal')
    if ephemeral and action not in policy.get('allowed_completion_actions',['remove_shutdown']): reasons.append('ephemeral_completion_action_not_disposal')
    if action == 'remove_shutdown' and pending > 0: reasons.append('cannot_dispose_with_pending_tool_calls')
    if reasons: return {'ok':False,'decision':'block','reasons':sorted(set(reasons))}
    return {'ok':True,'decision':'allow','resource_intent':'tool-enabled' if tools_required else 'tool-free','required_completion':action}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--event',required=True); ap.add_argument('--policy',required=True); args=ap.parse_args()
    result=evaluate(load(args.event),load(args.policy)); print(json.dumps(result,indent=2,sort_keys=True)); return 0 if result['ok'] else 3
if __name__=='__main__': raise SystemExit(main())
