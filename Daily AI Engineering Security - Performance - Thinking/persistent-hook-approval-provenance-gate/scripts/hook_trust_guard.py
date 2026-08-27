#!/usr/bin/env python3
import argparse, json, os
from pathlib import Path

def load(path):
    try: return json.loads(Path(path).read_text(encoding='utf-8'))
    except Exception as e:
        print(json.dumps({'ok':False,'decision':'block','reasons':[f'input_error:{e}']})); raise SystemExit(2)

def inside(path, roots):
    try:
        p=os.path.normcase(os.path.abspath(path))
        for r in roots:
            rr=os.path.normcase(os.path.abspath(r))
            if os.path.commonpath([p,rr])==rr: return True
    except (ValueError,TypeError): pass
    return False

def evaluate(e, policy):
    req=['hook_key','current_hash','hook_scope','event','session_cwd','authoritative_trusted_roots','approval_input_origin','initiator']
    reasons=[f'missing:{k}' for k in req if k not in e]
    if reasons: return {'ok':False,'decision':'block','reasons':reasons}
    roots=e.get('authoritative_trusted_roots')
    if not isinstance(roots,list) or not roots:
        reasons.append('no_authoritative_trusted_root')
    elif policy.get('require_authoritative_cwd_trust',True) and not inside(e['session_cwd'],roots):
        reasons.append('cwd_not_authoritatively_trusted')
    if e.get('event') not in policy.get('lifecycle_events',[]): reasons.append('unknown_lifecycle_event')
    if e.get('is_modified') and policy.get('require_reapproval_on_hash_change',True):
        if e.get('approved_hash')!=e.get('current_hash'): reasons.append('modified_hook_requires_reapproval')
    if e.get('approved_hash') and e.get('approved_hash')!=e.get('current_hash'):
        reasons.append('approved_hash_mismatch')
    protected=e.get('hook_scope') in policy.get('protected_scopes',[])
    human_origin=e.get('approval_input_origin') in policy.get('allowed_human_origins',[])
    if protected and not human_origin: reasons.append('protected_hook_requires_trusted_approval_origin')
    if e.get('approval_input_origin') in {'agent-pty','model-tool','nested-tui-automation'}:
        reasons.append('agent_synthesized_approval_forbidden')
    if e.get('initiator') in {'server-tool','agent'} and not human_origin and protected:
        reasons.append('nonhuman_initiator_cannot_establish_persistent_trust')
    if reasons:
        return {'ok':False,'decision':'block','hook_key':e.get('hook_key'),'reasons':sorted(set(reasons))}
    return {'ok':True,'decision':'allow','hook_key':e['hook_key'],'bound_hash':e['current_hash'],'trusted_cwd':os.path.abspath(e['session_cwd'])}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--event',required=True); ap.add_argument('--policy',required=True); a=ap.parse_args()
    r=evaluate(load(a.event),load(a.policy)); print(json.dumps(r,indent=2,sort_keys=True)); return 0 if r['ok'] else 3
if __name__=='__main__': raise SystemExit(main())
