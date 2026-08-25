#!/usr/bin/env python3
import argparse,json,sys

def decide(o):
    required=("silence_s","p99_gap_s","transport","progress_age_s","retry_count","hard_ceiling_s")
    miss=[k for k in required if k not in o]
    if miss: raise ValueError("missing fields: "+", ".join(miss))
    silence=float(o["silence_s"]); p99=max(float(o["p99_gap_s"]),1.0); progress=float(o["progress_age_s"])
    retries=int(o["retry_count"]); ceiling=float(o["hard_ceiling_s"]); transport=str(o["transport"])
    if min(silence,progress,retries,ceiling)<0: raise ValueError("numeric fields must be non-negative")
    if retries>=2: return {"action":"escalate","reason":"retry budget exhausted","next_deadline_s":0}
    if silence>=ceiling: return {"action":"abort","reason":"hard ceiling exceeded","next_deadline_s":0}
    if transport in {"closed","failed"} and progress>=min(p99,120):
        return {"action":"abort","reason":"transport failed and no recent progress","next_deadline_s":0}
    adaptive=min(ceiling,max(600.0,p99*1.25))
    if silence<adaptive: return {"action":"continue","reason":"within adaptive latency envelope","next_deadline_s":round(adaptive-silence,3)}
    if progress<adaptive:
        return {"action":"defer","reason":"recent observable progress despite silence","next_deadline_s":round(min(ceiling-silence,max(30.0,p99*0.25)),3)}
    return {"action":"defer","reason":"ambiguous liveness; one bounded grace interval","next_deadline_s":round(min(ceiling-silence,max(30.0,p99*0.15)),3)}

def main():
    p=argparse.ArgumentParser(); p.add_argument("observation",help="JSON file or - for stdin"); a=p.parse_args()
    try:
        raw=sys.stdin.read() if a.observation=="-" else open(a.observation,encoding="utf-8").read()
        out=decide(json.loads(raw)); print(json.dumps(out,sort_keys=True)); return {"continue":0,"defer":0,"abort":3,"escalate":4}[out["action"]]
    except (OSError,json.JSONDecodeError,ValueError) as e:
        print(str(e),file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())
