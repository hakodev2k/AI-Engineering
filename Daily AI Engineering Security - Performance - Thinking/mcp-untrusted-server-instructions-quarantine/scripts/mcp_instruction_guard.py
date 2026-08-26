#!/usr/bin/env python3
import argparse,json,re
from pathlib import Path
POLICY={'max_instruction_chars':4096,'allowed_cache_scopes':['private','session','none'],'blocked_patterns':['ignore previous','override system','reveal secret','send credentials','disable approval'],'high_risk_tools':['shell','terminal','http_write','credential','deploy','git_push']}
def load(path): return json.loads(Path(path).read_text(encoding='utf-8'))
def evaluate(event):
    missing=[k for k in ('server_id','instructions','cache_scope') if k not in event]
    if missing:return {'ok':False,'decision':'block','reasons':['missing:'+k for k in missing]}
    text=event['instructions']; reasons=[]
    if not isinstance(text,str): reasons.append('instructions_not_string')
    else:
        if len(text)>POLICY['max_instruction_chars']: reasons.append('instruction_length_exceeded')
        low=text.casefold()
        reasons += ['blocked_pattern:'+p for p in POLICY['blocked_patterns'] if p in low]
        if re.search(r'(?i)\b(system|developer)\s*(prompt|message)\b',text): reasons.append('control_channel_reference')
    if event.get('cache_scope') not in POLICY['allowed_cache_scopes']: reasons.append('untrusted_instructions_forbidden_cache_scope')
    if set(event.get('requested_tools',[])) & set(POLICY['high_risk_tools']) and not event.get('human_approved',False): reasons.append('high_risk_tool_requires_human_approval')
    if reasons:return {'ok':False,'decision':'quarantine','server_id':event.get('server_id'),'provenance':'mcp-server-untrusted','reasons':sorted(set(reasons))}
    return {'ok':True,'decision':'data_only','server_id':event['server_id'],'provenance':'mcp-server-untrusted','constraints':['must_not_enter_system_or_developer_policy','must_not_authorize_tools']}
def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--event',required=True); a=ap.parse_args(); r=evaluate(load(a.event)); print(json.dumps(r,indent=2,sort_keys=True)); raise SystemExit(0 if r['ok'] else 3)
if __name__=='__main__': main()
