#!/usr/bin/env python3
"""Analyze JSONL orchestration traces for model-mediated no-progress polling."""
import argparse, json, pathlib, sys

POLL_KINDS = {"poll", "wait", "wait_agent", "list_agents", "status"}

def load_json(path):
    try:
        return json.loads(pathlib.Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read config: {exc}") from exc

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("trace")
    ap.add_argument("--config", required=True)
    args = ap.parse_args()
    try:
        cfg = load_json(args.config)
        events=[]
        for n,line in enumerate(pathlib.Path(args.trace).read_text(encoding="utf-8").splitlines(),1):
            if not line.strip(): continue
            obj=json.loads(line)
            if not isinstance(obj,dict) or "kind" not in obj: raise ValueError(f"line {n}: object with kind required")
            events.append(obj)
        if not events: raise ValueError("trace is empty")
    except Exception as exc:
        print(json.dumps({"status":"INVALID","error":str(exc)})); return 2
    turns=[e for e in events if e.get("kind")=="model_turn"]
    poll_turns=[e for e in turns if e.get("action") in POLL_KINDS and not e.get("state_changed",False)]
    total_tokens=sum(max(0,int(e.get("tokens_in",0)))+max(0,int(e.get("tokens_out",0))) for e in turns)
    poll_tokens=sum(max(0,int(e.get("tokens_in",0)))+max(0,int(e.get("tokens_out",0))) for e in poll_turns)
    longest=cur=0
    for e in turns:
        if e in poll_turns: cur+=1; longest=max(longest,cur)
        else: cur=0
    tr=len(poll_turns)/len(turns) if turns else 0.0
    kr=poll_tokens/total_tokens if total_tokens else 0.0
    breaches=[]
    if tr>float(cfg["max_poll_turn_ratio"]): breaches.append("poll_turn_ratio")
    if kr>float(cfg["max_poll_token_ratio"]): breaches.append("poll_token_ratio")
    if longest>int(cfg["max_consecutive_no_progress_polls"]): breaches.append("consecutive_no_progress_polls")
    result={"status":"BLOCK" if breaches else "PASS","model_turns":len(turns),"polling_only_turns":len(poll_turns),"poll_turn_ratio":round(tr,6),"total_tokens":total_tokens,"poll_tokens":poll_tokens,"poll_token_ratio":round(kr,6),"max_consecutive_no_progress_polls":longest,"breaches":breaches}
    print(json.dumps(result,indent=2)); return 3 if breaches else 0

if __name__=="__main__": raise SystemExit(main())
