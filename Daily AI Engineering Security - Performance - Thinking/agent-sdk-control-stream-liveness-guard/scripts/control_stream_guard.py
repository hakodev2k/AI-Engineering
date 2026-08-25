#!/usr/bin/env python3
import argparse, json, statistics, sys
from pathlib import Path

START_END={"turn_start":("turns",True),"turn_end":("turns",False),"control_open":("controls",True),"control_settle":("controls",False),"worker_start":("workers",True),"worker_end":("workers",False)}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("trace"); a=ap.parse_args()
    sets={"turns":set(),"controls":set(),"workers":set()}; findings=[]; lat=[]; starts={}
    try: lines=Path(a.trace).read_text(encoding="utf-8").splitlines()
    except OSError as e: print(json.dumps({"error":str(e)})); return 64
    for n,line in enumerate(lines,1):
        if not line.strip(): continue
        try: e=json.loads(line)
        except json.JSONDecodeError as ex: print(json.dumps({"error":f"line {n}: {ex}"})); return 64
        typ=e.get("event"); ident=e.get("id")
        if typ in START_END:
            bucket,is_start=START_END[typ]
            if not isinstance(ident,str) or not ident:
                print(json.dumps({"error":f"line {n}: {typ} requires id"})); return 64
            if is_start:
                if ident in sets[bucket]: findings.append({"line":n,"kind":"duplicate-start","event":typ,"id":ident})
                sets[bucket].add(ident)
                if typ=="turn_start" and isinstance(e.get("ts_ms"),(int,float)): starts[ident]=e["ts_ms"]
            else:
                if ident not in sets[bucket]: findings.append({"line":n,"kind":"end-without-start","event":typ,"id":ident})
                else: sets[bucket].remove(ident)
                if typ=="turn_end" and ident in starts and isinstance(e.get("ts_ms"),(int,float)):
                    d=e["ts_ms"]-starts[ident]
                    if d>=0: lat.append(d)
        elif typ=="transport_close":
            active={k:sorted(v) for k,v in sets.items() if v}
            if active: findings.append({"line":n,"kind":"premature-close","active":active})
        elif typ=="tool_failure" and "stream closed" in str(e.get("error","")).lower():
            findings.append({"line":n,"kind":"stream-closed-tool-failure"})
        elif typ is None:
            print(json.dumps({"error":f"line {n}: missing event"})); return 64
    remaining={k:sorted(v) for k,v in sets.items() if v}
    if remaining: findings.append({"kind":"unsettled-at-eof","active":remaining})
    metrics={"events":sum(1 for x in lines if x.strip()),"turn_latency_ms_p50":statistics.median(lat) if lat else None,"turns_timed":len(lat)}
    report={"accepted":not findings,"finding_count":len(findings),"findings":findings,"metrics":metrics}
    print(json.dumps(report,indent=2,sort_keys=True)); return 0 if not findings else 2

if __name__=="__main__": sys.exit(main())
