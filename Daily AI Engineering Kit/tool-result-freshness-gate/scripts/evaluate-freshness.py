#!/usr/bin/env python3
import argparse, json, sys
from datetime import datetime, timezone


def load(path):
    with open(path, encoding="utf-8") as f: return json.load(f)

def parse_ts(s): return datetime.fromisoformat(s.replace("Z", "+00:00"))

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--record", required=True)
    p.add_argument("--state", required=True)
    p.add_argument("--events", required=True)
    p.add_argument("--policy", required=True)
    p.add_argument("--now")
    a=p.parse_args()
    try:
        r,s,e,pol=load(a.record),load(a.state),load(a.events),load(a.policy)
        now=parse_ts(a.now) if a.now else datetime.now(timezone.utc)
        observed=parse_ts(r["observed_at"])
    except Exception as ex:
        print(json.dumps({"status":"blocked","reasons":[f"invalid input: {ex}"]})); return 2
    reasons=[]
    ttl=pol.get("volatility_ttl_seconds",{}).get(r.get("volatility"),pol.get("default_ttl_seconds",900))
    if (now-observed).total_seconds() > ttl:
        reasons.append("ttl-expired")
    current=s.get("sources",{}).get(r["source"]["identity"])
    if current is None:
        reasons.append("source-state-missing")
    else:
        current_revision=str(current.get("revision","unknown"))
        recorded_revision=str(r["source"].get("revision","unknown"))
        if recorded_revision != "unknown" and current_revision != "unknown" and current_revision != recorded_revision:
            reasons.append("source-revision-changed")
    for ev in e.get("events",[]):
        try: ev_time=parse_ts(ev["occurred_at"])
        except Exception: continue
        if ev_time <= observed: continue
        applies = ev.get("source_identity") in (None, "*", r["source"]["identity"])
        if applies and ev.get("type") in set(r.get("invalidation_signals",[])):
            reasons.append(f"invalidation-event:{ev.get('type')}")
    expected_query=s.get("expected_query_fingerprints",{}).get(r["result_id"])
    if expected_query and expected_query != r["query_fingerprint"]:
        reasons.append("query-fingerprint-drift")
    status="fresh" if not reasons else "refresh-required"
    print(json.dumps({"status":status,"result_id":r["result_id"],"reasons":sorted(set(reasons)),"observed_at":r["observed_at"]}))
    return 0 if status=="fresh" else 3

if __name__=="__main__": sys.exit(main())
