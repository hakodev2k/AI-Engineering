#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

def stable_json(v): return json.dumps(v,sort_keys=True,separators=(",",":"),ensure_ascii=False)

def fingerprint(event):
    content_hash=event.get("content_hash") or hashlib.sha256(str(event.get("content","")).encode()).hexdigest()
    material={"tool":event.get("tool"),"source":event.get("source"),"args":event.get("args"),"content_hash":content_hash}
    return hashlib.sha256(stable_json(material).encode()).hexdigest()

def validate(event):
    if not isinstance(event,dict): raise ValueError("event must be an object")
    for k in ("tool","source"):
        if not isinstance(event.get(k),str) or not event[k]: raise ValueError(f"{k} must be non-empty")
    if event.get("secret") is True: raise ValueError("secret-bearing tool results must not be persisted")
    if not isinstance(event.get("summary"),str) or not event["summary"].strip(): raise ValueError("summary must be non-empty")

def load_ledger(path):
    p=Path(path); rows=[]
    if not p.exists(): return rows
    for i,line in enumerate(p.read_text(encoding="utf-8").splitlines(),1):
        if not line.strip(): continue
        try: rows.append(json.loads(line))
        except Exception as e: raise ValueError(f"ledger line {i}: {e}")
    return rows

def ingest(path,event):
    validate(event); f=fingerprint(event); rows=load_ledger(path)
    if any(r.get("fingerprint")==f for r in rows): return {"status":"duplicate","fingerprint":f}
    row={"fingerprint":f,"tool":event["tool"],"source":event["source"],"summary":event["summary"],"relevance":float(event.get("relevance",0.5)),"freshness_epoch":int(event.get("freshness_epoch",0)),"raw_chars":int(event.get("raw_chars",len(str(event.get("content","")))))}
    p=Path(path); p.parent.mkdir(parents=True,exist_ok=True)
    with p.open("a",encoding="utf-8") as out: out.write(json.dumps(row,sort_keys=True,ensure_ascii=False)+"\n")
    return {"status":"inserted","fingerprint":f}

def project(rows,max_chars=6000,max_entries=12,min_relevance=0.25,max_summary_chars=800):
    unique={}
    for r in rows:
        f=r.get("fingerprint")
        if not f: continue
        old=unique.get(f)
        if old is None or int(r.get("freshness_epoch",0))>=int(old.get("freshness_epoch",0)): unique[f]=r
    ranked=sorted((r for r in unique.values() if float(r.get("relevance",0))>=min_relevance),key=lambda r:(-float(r.get("relevance",0)),-int(r.get("freshness_epoch",0)),r["fingerprint"]))
    entries=[]; used=0
    for r in ranked[:max_entries]:
        item={"ref":r["fingerprint"][:16],"tool":r.get("tool"),"source":r.get("source"),"summary":str(r.get("summary",""))[:max_summary_chars]}
        n=len(stable_json(item))
        if used+n>max_chars: continue
        entries.append(item); used+=n
    raw=sum(int(r.get("raw_chars",0)) for r in unique.values())
    return {"entries":entries,"projection_chars":used,"raw_chars_avoided":max(0,raw-used),"unique_entries":len(unique)}

def main():
    ap=argparse.ArgumentParser(); sub=ap.add_subparsers(dest="cmd",required=True)
    a=sub.add_parser("ingest"); a.add_argument("--ledger",required=True); a.add_argument("--event",required=True)
    p=sub.add_parser("project"); p.add_argument("--ledger",required=True); p.add_argument("--max-chars",type=int,default=6000)
    ns=ap.parse_args()
    try:
        if ns.cmd=="ingest": result=ingest(ns.ledger,json.loads(Path(ns.event).read_text(encoding="utf-8")))
        else: result=project(load_ledger(ns.ledger),max_chars=ns.max_chars)
    except Exception as e: print(json.dumps({"ok":False,"error":str(e)})); return 2
    print(json.dumps({"ok":True,**result},indent=2,sort_keys=True,ensure_ascii=False)); return 0
if __name__=="__main__": raise SystemExit(main())
