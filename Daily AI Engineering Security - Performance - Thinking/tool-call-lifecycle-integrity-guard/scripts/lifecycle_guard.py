#!/usr/bin/env python3
"""Validate tool-call lifecycle integrity. Exit 0 allow, 2 invalid, 4 approval required, 5 deny/integrity error."""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path
from typing import Any
ALLOW, INVALID, APPROVAL, DENY = 0, 2, 4, 5

def load(path: Path)->dict[str,Any]:
    try: x=json.loads(path.read_text(encoding='utf-8'))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f'cannot read {path}: {exc}') from exc
    if not isinstance(x,dict): raise ValueError(f'{path} must contain object')
    return x

def arg_hash(args:Any)->str:
    raw=json.dumps(args,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode('utf-8')
    return hashlib.sha256(raw).hexdigest()

def decide(r:dict[str,Any], p:dict[str,Any], phase:str)->tuple[dict[str,Any],int]:
    call_id=r.get('call_id'); tool=r.get('tool'); args=r.get('args'); caps=r.get('capabilities',[])
    if not isinstance(call_id,str) or not call_id: raise ValueError('call_id required')
    if not isinstance(tool,str) or not tool: raise ValueError('tool required')
    if not isinstance(caps,list) or not all(isinstance(x,str) for x in caps): raise ValueError('capabilities must be strings')
    h=arg_hash(args); violations=[]
    if r.get('duplicate_call_id') is True or r.get('already_executed') is True:
        violations.append('duplicate_or_already_executed_call')
    if r.get('tool_enabled') is not True:
        violations.append('tool_not_currently_enabled')
    if phase=='preinvoke' and r.get('resumed') is True and p.get('require_preinvoke_guardrail_after_resume',True) and r.get('preinvoke_guardrail_passed') is not True:
        violations.append('missing_fresh_preinvoke_guardrail')
    approval=r.get('approval',{})
    if not isinstance(approval,dict): raise ValueError('approval must be object')
    high=bool(set(caps).intersection(set(p.get('high_impact_capabilities',[]))))
    if high:
        approved = approval.get('granted') is True and approval.get('call_id')==call_id and approval.get('tool')==tool and approval.get('argument_sha256')==h
        if not approved and not violations:
            return {'decision':'approval_required','call_id':call_id,'argument_sha256':h,'violations':[]}, APPROVAL
    if phase=='postpersist':
        executed=r.get('already_executed') is True
        terminal_count=r.get('terminal_record_count')
        if not isinstance(terminal_count,int) or terminal_count < 0: raise ValueError('terminal_record_count must be non-negative int')
        if executed and terminal_count != 1: violations.append('executed_call_requires_exactly_one_terminal_record')
        if terminal_count > 1: violations.append('duplicate_terminal_records')
    if violations:
        return {'decision':'deny','call_id':call_id,'argument_sha256':h,'violations':violations}, DENY
    return {'decision':'allow','call_id':call_id,'argument_sha256':h,'violations':[]}, ALLOW

def main()->int:
    ap=argparse.ArgumentParser(); ap.add_argument('record',type=Path); ap.add_argument('--policy',type=Path,required=True); ap.add_argument('--phase',choices=['preinvoke','postpersist'],required=True); a=ap.parse_args()
    try: out,code=decide(load(a.record),load(a.policy),a.phase)
    except (ValueError,TypeError) as exc: print(json.dumps({'decision':'invalid','error':str(exc)}),file=sys.stderr); return INVALID
    print(json.dumps(out,indent=2,ensure_ascii=False)); return code
if __name__=='__main__': raise SystemExit(main())
