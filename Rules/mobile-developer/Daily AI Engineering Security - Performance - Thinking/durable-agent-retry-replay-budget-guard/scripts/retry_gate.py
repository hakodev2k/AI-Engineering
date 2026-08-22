#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

ALLOW, INVALID, ESCALATE, STOP = 0, 2, 3, 4

def load(path: Path):
    try: data=json.loads(path.read_text(encoding='utf-8'))
    except (OSError,json.JSONDecodeError) as e: raise ValueError(f'cannot read {path}: {e}') from e
    if not isinstance(data,dict): raise ValueError(f'{path} must contain an object')
    return data

def nonneg(d,k):
    v=d.get(k,0)
    if not isinstance(v,(int,float)) or isinstance(v,bool) or v<0: raise ValueError(f'{k} must be non-negative number')
    return v

def main():
    p=argparse.ArgumentParser(description='Bound expensive durable-agent retries')
    p.add_argument('input',type=Path); p.add_argument('--config',type=Path,required=True)
    a=p.parse_args()
    try:
        d,c=load(a.input),load(a.config)
        fp=d.get('request_fingerprint'); prev=d.get('previous_request_fingerprint'); checkpoint=d.get('checkpoint_id')
        if not isinstance(fp,str) or not fp: raise ValueError('request_fingerprint required')
        if prev is not None and not isinstance(prev,str): raise ValueError('previous_request_fingerprint must be string or null')
        for k in ('progress_changed','request_changed'):
            if not isinstance(d.get(k,False),bool): raise ValueError(f'{k} must be boolean')
        attempts=int(nonneg(d,'attempts')); identical=int(nonneg(d,'identical_request_retries')); no_progress=int(nonneg(d,'no_progress_retries'))
        tokens=nonneg(d,'replayed_tokens'); tools=int(nonneg(d,'post_failure_tool_calls')); wall=nonneg(d,'post_failure_wall_seconds')
        reasons=[]; decision='retry'; code=ALLOW
        if attempts >= int(c.get('max_attempts',4)):
            decision='stop'; code=STOP; reasons.append('attempt budget exhausted')
        if identical >= int(c.get('max_identical_request_retries',1)) and fp==prev and not d.get('request_changed'):
            decision='escalate'; code=ESCALATE; reasons.append('identical request replay budget exhausted')
        if no_progress >= int(c.get('max_no_progress_retries',2)) and not d.get('progress_changed'):
            decision='escalate'; code=ESCALATE; reasons.append('no-progress retry budget exhausted')
        if tokens >= c.get('max_replayed_tokens',100000):
            decision='stop'; code=STOP; reasons.append('replayed token budget exhausted')
        if tools >= int(c.get('max_post_failure_tool_calls',20)):
            decision='stop'; code=STOP; reasons.append('post-failure tool-call budget exhausted')
        if wall >= c.get('max_post_failure_wall_seconds',900):
            decision='stop'; code=STOP; reasons.append('post-failure wall-time budget exhausted')
        if c.get('require_checkpoint_for_full_turn_replay',True) and d.get('full_turn_replay',False) and not checkpoint:
            decision='escalate'; code=ESCALATE; reasons.append('full-turn replay lacks safe checkpoint')
        if code==ALLOW and checkpoint:
            decision='resume_checkpoint'; reasons.append('retry within budget from latest safe checkpoint')
        elif code==ALLOW:
            reasons.append('retry within budget')
        out={'decision':decision,'reasons':reasons,'remaining':{
            'attempts':max(0,int(c.get('max_attempts',4))-attempts),
            'replayed_tokens':max(0,c.get('max_replayed_tokens',100000)-tokens),
            'tool_calls':max(0,int(c.get('max_post_failure_tool_calls',20))-tools),
            'wall_seconds':max(0,c.get('max_post_failure_wall_seconds',900)-wall)
        }}
    except (ValueError,TypeError) as e:
        print(json.dumps({'decision':'invalid','error':str(e)}),file=sys.stderr); return INVALID
    print(json.dumps(out,indent=2)); return code
if __name__=='__main__': raise SystemExit(main())
