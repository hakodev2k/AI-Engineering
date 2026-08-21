#!/usr/bin/env python3
"""Evaluate an observable agent-event JSONL trace for no-progress loops.

Input: one JSON object per line. Supported fields:
  type: action | result | progress | turn
  tool: optional tool name
  args: optional object/string
  output: optional result text/object
  marker: optional progress marker

Exit codes: 0=healthy, 2=warning threshold, 3=stop threshold, 4=input/config error.
No repository mutation and no network access.
"""
from __future__ import annotations
import argparse, hashlib, json, re, sys
from collections import Counter
from pathlib import Path

VOLATILE = re.compile(r"(?i)(timestamp|time|request[_-]?id|trace[_-]?id|nonce|elapsed|duration)")

def stable(v):
    if isinstance(v, dict):
        return {k: stable(x) for k, x in sorted(v.items()) if not VOLATILE.search(str(k))}
    if isinstance(v, list): return [stable(x) for x in v]
    if isinstance(v, str): return re.sub(r"\s+", " ", v.strip())[:4000]
    return v

def fp(v):
    raw=json.dumps(stable(v), sort_keys=True, ensure_ascii=False, separators=(",",":"))
    return hashlib.sha256(raw.encode()).hexdigest()[:16]

def load_json(path):
    try: return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e: raise ValueError(f"cannot read config: {e}")

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("trace")
    ap.add_argument("--config", default=str(Path(__file__).parents[1]/"config"/"policy.json"))
    ap.add_argument("--json", action="store_true")
    a=ap.parse_args()
    try:
        cfg=load_json(a.config)
        events=[]
        for n,line in enumerate(Path(a.trace).read_text(encoding="utf-8").splitlines(),1):
            if not line.strip(): continue
            try: events.append(json.loads(line))
            except Exception as e: raise ValueError(f"invalid JSON line {n}: {e}")
    except Exception as e:
        print(str(e), file=sys.stderr); return 4

    action_fps=[]; result_fps=[]; no_progress=0; progress_count=0
    last_progress_index=-1
    for i,e in enumerate(events):
        t=e.get("type")
        if t=="action": action_fps.append(fp({"tool":e.get("tool"),"args":e.get("args")}))
        elif t=="result": result_fps.append(fp(e.get("output")))
        elif t=="progress":
            progress_count+=1; last_progress_index=i
    if last_progress_index < 0:
        no_progress=sum(1 for e in events if e.get("type")=="turn") or len(action_fps)
    else:
        no_progress=sum(1 for e in events[last_progress_index+1:] if e.get("type") in ("turn","action"))

    w=int(cfg["window_size"])
    recent_actions=action_fps[-w:]; recent_results=result_fps[-w:]
    ac=Counter(recent_actions); rc=Counter(recent_results)
    max_action=max(ac.values(), default=0); max_result=max(rc.values(), default=0)
    novelty=(len(set(recent_actions))/len(recent_actions)) if recent_actions else 1.0

    reasons=[]; status="healthy"; code=0
    if no_progress >= int(cfg["warn_after_no_progress_turns"]): reasons.append("no_progress_warn")
    if max_action > int(cfg["max_identical_action_fingerprint"]): reasons.append("action_repetition")
    if max_result > int(cfg["max_identical_result_fingerprint"]): reasons.append("result_repetition")
    if novelty < float(cfg["minimum_novelty_ratio"]): reasons.append("low_action_novelty")
    hard = no_progress >= int(cfg["stop_after_no_progress_turns"]) and (max_action > int(cfg["max_identical_action_fingerprint"]) or novelty < float(cfg["minimum_novelty_ratio"]))
    if hard: status="stop"; code=3
    elif reasons: status="warn"; code=2

    report={"status":status,"reasons":reasons,"events":len(events),"progress_events":progress_count,"no_progress_count":no_progress,"max_identical_action":max_action,"max_identical_result":max_result,"action_novelty_ratio":round(novelty,3)}
    print(json.dumps(report, indent=2) if a.json else f"{status.upper()}: "+json.dumps(report, separators=(",",":")))
    return code

if __name__=="__main__": raise SystemExit(main())
