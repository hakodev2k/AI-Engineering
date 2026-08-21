#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

ALLOWED_STATUS={"unresolved","provisional","verified","blocked"}
ALLOWED_REL={"supports","contradicts","context"}
ALLOWED_IMPACT={"low","medium","high"}

def fail(msg):
    print(f"ERROR: {msg}", file=sys.stderr); return 1

def main():
    p=argparse.ArgumentParser(); p.add_argument("matrix"); a=p.parse_args()
    path=Path(a.matrix)
    if not path.is_file(): return fail(f"file not found: {path}")
    try: data=json.loads(path.read_text(encoding="utf-8"))
    except Exception as e: return fail(f"invalid JSON: {e}")
    if not isinstance(data,dict) or not isinstance(data.get("claims"),list): return fail("root.claims must be an array")
    ids=set(); errors=[]
    for i,c in enumerate(data["claims"]):
        if not isinstance(c,dict): errors.append(f"claims[{i}] must be object"); continue
        cid=c.get("id"); text=c.get("claim"); impact=c.get("impact"); status=c.get("status"); conf=c.get("confidence")
        if not isinstance(cid,str) or not cid: errors.append(f"claims[{i}].id required")
        elif cid in ids: errors.append(f"duplicate claim id {cid}")
        else: ids.add(cid)
        if not isinstance(text,str) or not text.strip(): errors.append(f"{cid or i}: claim required")
        if impact not in ALLOWED_IMPACT: errors.append(f"{cid or i}: invalid impact")
        if status not in ALLOWED_STATUS: errors.append(f"{cid or i}: invalid status")
        if not isinstance(conf,(int,float)) or not 0 <= conf <= 1: errors.append(f"{cid or i}: confidence must be 0..1")
        ev=c.get("evidence",[])
        if not isinstance(ev,list): errors.append(f"{cid or i}: evidence must be array"); continue
        if impact in {"medium","high"} and not ev: errors.append(f"{cid or i}: medium/high impact claim needs evidence")
        for j,e in enumerate(ev):
            if not isinstance(e,dict): errors.append(f"{cid or i}: evidence[{j}] must be object"); continue
            if e.get("relationship") not in ALLOWED_REL: errors.append(f"{cid or i}: evidence[{j}] invalid relationship")
            if not isinstance(e.get("source"),str) or not e.get("source").strip(): errors.append(f"{cid or i}: evidence[{j}] source required")
        if status=="verified" and conf < 0.75: errors.append(f"{cid or i}: verified claim confidence below 0.75")
        if status=="verified" and any(e.get("relationship")=="contradicts" and e.get("blocking",False) for e in ev if isinstance(e,dict)):
            errors.append(f"{cid or i}: verified claim has blocking contradiction")
    if errors:
        for e in errors: print(f"ERROR: {e}", file=sys.stderr)
        return 2
    print(f"OK: validated {len(data['claims'])} claims")
    return 0
if __name__=="__main__": raise SystemExit(main())