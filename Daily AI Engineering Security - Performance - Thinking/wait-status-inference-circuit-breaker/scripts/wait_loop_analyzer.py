#!/usr/bin/env python3
"""Analyze JSONL agent tool events for repeated no-progress wait/status loops."""
import argparse, json, sys
from collections import Counter

WAIT_TOOLS={"wait","wait_agent","list_agents","status","write_stdin"}

def norm(e):
    tool=str(e.get("tool","")); target=e.get("target") or e.get("cell_id") or e.get("agent_id")
    result=e.get("result_state") or e.get("status") or e.get("result")
    version=e.get("state_version")
    return json.dumps([tool,target,result,version],sort_keys=True,default=str)

def main():
    p=argparse.ArgumentParser(); p.add_argument("trace"); p.add_argument("--breaker",type=int,default=5); a=p.parse_args()
    if a.breaker<2: print("breaker must be >=2",file=sys.stderr); return 2
    events=[]
    try:
        with open(a.trace,encoding="utf-8") as f:
            for n,line in enumerate(f,1):
                if line.strip():
                    x=json.loads(line); x["_line"]=n; events.append(x)
    except Exception as e: print(f"invalid trace: {e}",file=sys.stderr); return 2
    waits=[e for e in events if str(e.get("tool","")) in WAIT_TOOLS]
    total_tokens=sum(int(e.get("input_tokens",0) or 0) for e in events)
    wait_tokens=sum(int(e.get("input_tokens",0) or 0) for e in waits)
    longest=0; current=0; last=None; breaker_events=[]
    for e in waits:
        s=norm(e)
        current=current+1 if s==last else 1; last=s; longest=max(longest,current)
        if current==a.breaker: breaker_events.append({"line":e["_line"],"signature":json.loads(s)})
    out={"events":len(events),"wait_events":len(waits),"wait_ratio":round(len(waits)/len(events),4) if events else 0,"input_tokens":total_tokens,"wait_input_tokens":wait_tokens,"wait_token_ratio":round(wait_tokens/total_tokens,4) if total_tokens else 0,"longest_identical_wait_run":longest,"breaker_candidates":breaker_events}
    print(json.dumps(out,indent=2))
    return 3 if breaker_events else 0
if __name__=="__main__": raise SystemExit(main())
