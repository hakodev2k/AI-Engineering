#!/usr/bin/env python3
import json,sys
from pathlib import Path

def load(p):
    try:return json.loads(Path(p).read_text(encoding="utf-8"))
    except Exception as e:raise ValueError(f"cannot read {p}: {e}")
def event_metrics(e):
    b=int(e["tokens_before"]); a=int(e["tokens_after"]); cap=int(e["context_window"]); res=int(e.get("reserved_tokens",0))
    if b<0 or a<0 or cap<=0 or res<0 or res>=cap: raise ValueError("invalid token values")
    reclaimed=b-a; ratio=(reclaimed/b) if b else 0.0; util=a/(cap-res)
    return reclaimed,ratio,util
def main(argv):
    if len(argv)!=3: print(f"usage: {argv[0]} <policy.json> <events.jsonl>",file=sys.stderr);return 1
    try: p=load(argv[1]); lines=Path(argv[2]).read_text(encoding="utf-8").splitlines()
    except (OSError,ValueError) as e: print(f"ERROR: {e}",file=sys.stderr);return 1
    min_ratio=float(p.get("min_reclaim_ratio",0.15)); max_util=float(p.get("max_post_utilization",0.85)); min_turns=int(p.get("min_turns_between_compactions",2))
    bad=[]; events=[]
    for n,line in enumerate(lines,1):
        if not line.strip():continue
        try:e=json.loads(line); reclaimed,ratio,util=event_metrics(e)
        except Exception as x: print(f"ERROR line {n}: {x}",file=sys.stderr);return 1
        if reclaimed<=0 or ratio<min_ratio: bad.append((n,f"ineffective reclaim: {reclaimed} tokens, ratio={ratio:.3f}"))
        if util>max_util: bad.append((n,f"post-compaction utilization too high: {util:.3f}"))
        if "next_turn_tokens" in e:
            nxt=int(e["next_turn_tokens"]); growth=int(e.get("new_tokens_before_next_turn",0)); unexplained=nxt-(int(e["tokens_after"])+growth)
            if unexplained>int(p.get("max_unexplained_rebound_tokens",1024)): bad.append((n,f"unexplained next-turn rebound: {unexplained} tokens"))
        events.append((n,e))
    for (n1,e1),(n2,e2) in zip(events,events[1:]):
        if "turn" in e1 and "turn" in e2 and int(e2["turn"])-int(e1["turn"])<min_turns: bad.append((n2,"compaction retriggered too soon"))
    if bad:
        print("BLOCK")
        for n,r in bad:print(f"- line {n}: {r}")
        return 5
    print(f"PASS: {len(events)} compaction event(s) satisfy postconditions")
    return 0
if __name__=="__main__":sys.exit(main(sys.argv))
