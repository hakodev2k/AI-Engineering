#!/usr/bin/env python3
"""Profile long-thread TTFT from JSONL traces and enforce pre-turn size budgets."""
import argparse, json, statistics, sys
from pathlib import Path


def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))

def profile(path):
    turns = {}
    for i,line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(),1):
        if not line.strip(): continue
        event=json.loads(line); tid=str(event["turn_id"]); turns.setdefault(tid,{})[event["event"]]=float(event["ts_ms"])
    rows=[]
    for tid,e in turns.items():
        if "request_start" in e and "model_first_token" in e:
            ttft=e["model_first_token"]-e["request_start"]
            first_tool=(e.get("tool_start")-e["request_start"]) if "tool_start" in e else None
            rows.append({"turn_id":tid,"ttft_ms":ttft,"first_tool_ms":first_tool})
    if not rows: raise ValueError("no complete request_start/model_first_token pairs")
    vals=sorted(r["ttft_ms"] for r in rows)
    p95=vals[max(0, int((len(vals)-1)*0.95))]
    return {"turns":rows,"count":len(rows),"p50_ttft_ms":statistics.median(vals),"p95_ttft_ms":p95,"max_ttft_ms":max(vals)}

def gate(snapshot,warn_bytes,block_bytes,ttft_slo):
    b=int(snapshot.get("history_bytes",-1)); t=float(snapshot.get("recent_ttft_ms",0))
    if b < 0: raise ValueError("history_bytes is required and must be >=0")
    reasons=[]; status="PASS"; code=0
    if b >= block_bytes or (ttft_slo>0 and t >= ttft_slo*2): status="BLOCK"; code=2
    elif b >= warn_bytes or (ttft_slo>0 and t >= ttft_slo): status="WARN"; code=1
    if b >= warn_bytes: reasons.append("history_bytes")
    if ttft_slo>0 and t >= ttft_slo: reasons.append("recent_ttft_ms")
    return code,{"status":status,"history_bytes":b,"recent_ttft_ms":t,"reasons":reasons}

def main():
    p=argparse.ArgumentParser(); sub=p.add_subparsers(dest="cmd",required=True)
    a=sub.add_parser("profile"); a.add_argument("--trace",required=True)
    g=sub.add_parser("gate"); g.add_argument("--snapshot",required=True); g.add_argument("--warn-bytes",type=int,required=True); g.add_argument("--block-bytes",type=int,required=True); g.add_argument("--ttft-slo-ms",type=float,default=0)
    args=p.parse_args()
    try:
        if args.cmd=="profile": out=profile(args.trace); code=0
        else:
            if args.warn_bytes<0 or args.block_bytes<=args.warn_bytes: raise ValueError("require 0 <= warn-bytes < block-bytes")
            code,out=gate(load_json(args.snapshot),args.warn_bytes,args.block_bytes,args.ttft_slo_ms)
        print(json.dumps(out,sort_keys=True)); return code
    except (OSError,json.JSONDecodeError,KeyError,ValueError) as e:
        print(json.dumps({"status":"ERROR","error":str(e)})); return 3
if __name__=="__main__": sys.exit(main())
