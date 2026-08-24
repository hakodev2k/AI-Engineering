#!/usr/bin/env python3
import argparse, hashlib, json, sys
from datetime import datetime, timezone
from pathlib import Path

def inspect_jsonl(path):
    p=Path(path)
    if not p.is_file():
        return None
    raw=p.read_bytes(); count=0
    try:
        for line in raw.splitlines():
            if not line.strip(): continue
            json.loads(line); count+=1
    except Exception as e:
        raise ValueError(f"invalid_jsonl:{p}:{e}")
    return {"path":str(p),"records":count,"sha256":hashlib.sha256(raw).hexdigest(),"bytes":len(raw)}

def write(obj): print(json.dumps(obj,sort_keys=True))

def precommit(args):
    try: info=inspect_jsonl(args.source)
    except ValueError as e: write({"decision":"error","reason":str(e)}); return 3
    if info is None: write({"decision":"block","reason":"source_missing"}); return 2
    ledger={"version":1,"state":"precommitted","created_at":datetime.now(timezone.utc).isoformat(),"source":info}
    try: Path(args.ledger).write_text(json.dumps(ledger,indent=2,sort_keys=True),encoding="utf-8")
    except Exception as e: write({"decision":"error","reason":f"ledger_write_failed:{e}"}); return 3
    write({"decision":"precommitted","records":info["records"],"sha256":info["sha256"]}); return 0

def postcheck(args):
    try: ledger=json.loads(Path(args.ledger).read_text(encoding="utf-8"))
    except Exception as e: write({"decision":"error","reason":f"invalid_ledger:{e}"}); return 3
    expected=ledger.get("source",{})
    if not expected.get("sha256") or not isinstance(expected.get("records"),int):
        write({"decision":"error","reason":"ledger_missing_source_evidence"}); return 3
    candidates=[]
    for kind,path in (("source",args.source),("archive",args.archive)):
        if not path: continue
        try: info=inspect_jsonl(path)
        except ValueError as e: write({"decision":"error","reason":str(e),"candidate":kind}); return 3
        if info: candidates.append((kind,info))
    for kind,info in candidates:
        if info["records"]==expected["records"] and info["sha256"]==expected["sha256"]:
            write({"decision":"verified","matched":kind,"records":info["records"],"sha256":info["sha256"]}); return 0
    write({"decision":"block","reason":"no_matching_durable_source","expected_records":expected["records"],"candidates":[{"kind":k,"records":i["records"],"sha256":i["sha256"]} for k,i in candidates]}); return 2

def main():
    p=argparse.ArgumentParser(); sub=p.add_subparsers(dest="cmd",required=True)
    a=sub.add_parser("precommit"); a.add_argument("--source",required=True); a.add_argument("--ledger",required=True)
    b=sub.add_parser("postcheck"); b.add_argument("--ledger",required=True); b.add_argument("--source"); b.add_argument("--archive")
    args=p.parse_args()
    return precommit(args) if args.cmd=="precommit" else postcheck(args)

if __name__=="__main__": sys.exit(main())
