#!/usr/bin/env python3
import json, sys
from datetime import datetime, timezone
from pathlib import Path
LEVELS=["implemented","validated-local","validated-target","released","accepted"]
def load(p):
    try:return json.loads(Path(p).read_text(encoding="utf-8"))
    except Exception as e:raise ValueError(f"cannot read {p}: {e}")
def ts(s):
    try:
        d=datetime.fromisoformat(s.replace("Z","+00:00"));return d if d.tzinfo else d.replace(tzinfo=timezone.utc)
    except Exception:raise ValueError(f"invalid timestamp: {s}")
def main(a):
    if len(a)!=4 or a[3] not in LEVELS:print(f"usage: {a[0]} contract.json evidence.json <{'|'.join(LEVELS)}>",file=sys.stderr);return 1
    try:
        c,e=load(a[1]),load(a[2]);claim=a[3];criteria=c.get("criteria",[]);max_age=int(c.get("max_evidence_age_minutes",1440));budgets=c.get("circuit_breaker",{});events=e.get("evidence",[]);counters=e.get("counters",{})
        if not isinstance(criteria,list) or not isinstance(events,list):raise ValueError("criteria/evidence must be arrays")
        now=datetime.now(timezone.utc);missing=[];allowed_idx=LEVELS.index(claim)
        for cr in criteria:
            lvl=cr.get("required_for","validated-target")
            if LEVELS.index(lvl)>allowed_idx:continue
            matches=[x for x in events if x.get("criterion")==cr.get("id") and x.get("target")==c.get("target") and x.get("outcome")=="pass"]
            fresh=[x for x in matches if (now-ts(x.get("timestamp",""))).total_seconds()<=max_age*60]
            if not fresh:missing.append(cr.get("id","unnamed"))
        tripped=[k for k,limit in budgets.items() if isinstance(limit,(int,float)) and counters.get(k,0)>=limit]
        if tripped:print("CIRCUIT_BREAKER: "+", ".join(tripped));return 5
        if missing:print("BLOCK missing/failing/stale evidence: "+", ".join(missing));return 4
        print(f"PASS readiness={claim} target={c.get('target')}");return 0
    except (ValueError,KeyError,TypeError) as ex:print("ERROR: "+str(ex),file=sys.stderr);return 1
if __name__=="__main__":sys.exit(main(sys.argv))
