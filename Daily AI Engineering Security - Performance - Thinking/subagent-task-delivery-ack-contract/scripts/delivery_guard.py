#!/usr/bin/env python3
import json, sys
from collections import defaultdict

EVENTS={"spawn_requested","task_delivered","task_acknowledged","first_action","followup_delivered","followup_acknowledged","completed"}

def load(path):
    rows=[]
    with open(path,encoding="utf-8") as f:
        for n,line in enumerate(f,1):
            if not line.strip(): continue
            try:r=json.loads(line)
            except json.JSONDecodeError as e: raise ValueError(f"line {n}: invalid JSON: {e.msg}")
            if not isinstance(r,dict) or not isinstance(r.get("agent_id"),str) or r.get("event") not in EVENTS or not isinstance(r.get("ts_ms"),(int,float)):
                raise ValueError(f"line {n}: require agent_id:str, recognized event, ts_ms:number")
            if r["event"] in {"task_delivered","task_acknowledged","followup_delivered","followup_acknowledged"}:
                if not isinstance(r.get("seq"),int) or r["seq"]<1 or not isinstance(r.get("task_hash"),str) or len(r["task_hash"])!=64:
                    raise ValueError(f"line {n}: delivery/ack requires seq>=1 and 64-char task_hash")
            rows.append(r)
    if not rows: raise ValueError("empty trace")
    return rows

def analyze(rows):
    by=defaultdict(list)
    for r in rows: by[r["agent_id"]].append(r)
    result=[]
    for aid,rs in by.items():
        rs=sorted(rs,key=lambda r:r["ts_ms"]); v=[]; delivered={}; acked={}; first_action=None
        for r in rs:
            e=r["event"]
            if e in {"task_delivered","followup_delivered"}:
                if r["seq"] in delivered: v.append(f"duplicate_delivery_seq:{r['seq']}")
                delivered[r["seq"]]=(r["task_hash"],r["ts_ms"])
            elif e in {"task_acknowledged","followup_acknowledged"}:
                seq=r["seq"]
                if seq not in delivered: v.append(f"ack_without_delivery:{seq}")
                elif delivered[seq][0]!=r["task_hash"]: v.append(f"hash_mismatch:{seq}")
                else: acked[seq]=(r["task_hash"],r["ts_ms"])
            elif e=="first_action" and first_action is None: first_action=r["ts_ms"]
        if 1 not in delivered: v.append("missing_initial_delivery")
        if 1 not in acked: v.append("missing_initial_ack")
        if first_action is not None:
            if 1 not in acked or first_action < acked[1][1]: v.append("action_before_initial_ack")
        for seq in delivered:
            if seq>1 and seq not in acked: v.append(f"missing_followup_ack:{seq}")
        if delivered and sorted(delivered)!=list(range(1,max(delivered)+1)): v.append("non_contiguous_sequence")
        lat={str(s):acked[s][1]-delivered[s][1] for s in acked if s in delivered}
        result.append({"agent_id":aid,"status":"valid" if not v else "invalid","ack_latency_ms":lat,"latest_ack_seq":max(acked) if acked else None,"violations":v})
    return sorted(result,key=lambda x:x["agent_id"])

def main(argv):
    if len(argv)!=2:
        print("usage: delivery_guard.py TRACE.jsonl",file=sys.stderr); return 1
    try: out=analyze(load(argv[1]))
    except (OSError,ValueError) as e:
        print(str(e),file=sys.stderr); return 1
    print(json.dumps(out,indent=2,sort_keys=True))
    return 2 if any(x["status"]!="valid" for x in out) else 0

if __name__=="__main__": raise SystemExit(main(sys.argv))
