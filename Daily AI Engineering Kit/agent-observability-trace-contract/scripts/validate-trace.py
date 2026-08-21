#!/usr/bin/env python3
import argparse, json, re, sys
from collections import defaultdict
from pathlib import Path

TERMINAL = {"completed", "failed", "unknown", "abandoned", "granted", "denied", "expired"}

def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))

def main():
    p=argparse.ArgumentParser(); p.add_argument("--trace",required=True); p.add_argument("--policy",required=True); p.add_argument("--output",required=True); a=p.parse_args()
    policy=load_json(a.policy); findings=[]; events=[]
    sensitive=re.compile("|".join(re.escape(x) for x in policy.get("sensitive_key_patterns",[])),re.I)
    try:
        for i,line in enumerate(Path(a.trace).read_text(encoding="utf-8").splitlines(),1):
            if not line.strip(): continue
            e=json.loads(line); events.append(e)
            req=["event_version","timestamp","trace_id","span_id","event","actor","status","attributes"]
            for k in req:
                if k not in e: findings.append({"severity":"blocking","line":i,"code":"missing-field","detail":k})
            def walk(v,path="attributes"):
                if isinstance(v,dict):
                    for k,x in v.items():
                        if sensitive.search(str(k)): findings.append({"severity":"blocking","line":i,"code":"sensitive-key","detail":f"{path}.{k}"})
                        walk(x,f"{path}.{k}")
                elif isinstance(v,list):
                    for n,x in enumerate(v): walk(x,f"{path}[{n}]")
                elif isinstance(v,str) and len(v)>policy.get("max_attribute_string_length",512): findings.append({"severity":"warning","line":i,"code":"long-attribute","detail":path})
            walk(e.get("attributes",{}))
    except Exception as ex:
        findings.append({"severity":"blocking","code":"parse-error","detail":str(ex)})
    traces={e.get("trace_id") for e in events if e.get("trace_id")}
    if len(traces)!=1: findings.append({"severity":"blocking","code":"trace-id-count","detail":str(len(traces))})
    by_span=defaultdict(list)
    for e in events: by_span[e.get("span_id")].append(e)
    for sid,es in by_span.items():
        starts=[e for e in es if e.get("status") in {"started","requested"}]
        terms=[e for e in es if e.get("status") in TERMINAL]
        if starts and not terms: findings.append({"severity":"blocking","code":"open-span","detail":sid})
        if len(terms)>1 and not all(e.get("event","").startswith("approval.") for e in terms): findings.append({"severity":"warning","code":"multiple-terminal-events","detail":sid})
    attempts=defaultdict(list)
    for e in events:
        if e.get("event","").startswith("tool.") and e.get("attempt") is not None:
            key=(e.get("attributes",{}).get("operation_id",e.get("span_id")), e.get("event"))
            attempts[key].append(e.get("attempt"))
    for key,nums in attempts.items():
        if any(n<1 for n in nums): findings.append({"severity":"blocking","code":"invalid-attempt","detail":str(key)})
    if not any(e.get("event")=="verification.completed" for e in events): findings.append({"severity":"blocking","code":"missing-verification-completed"})
    result={"status":"valid" if not any(f["severity"]=="blocking" for f in findings) else "invalid","event_count":len(events),"findings":findings}
    Path(a.output).parent.mkdir(parents=True,exist_ok=True); Path(a.output).write_text(json.dumps(result,indent=2),encoding="utf-8")
    print(json.dumps(result)); return 0 if result["status"]=="valid" else 1
if __name__=="__main__": raise SystemExit(main())
