#!/usr/bin/env python3
import argparse, hashlib, json, re, sys
from pathlib import Path

def signatures(text):
    tokens=[]
    for line in text.splitlines():
        s=line.strip()
        if not s or s.startswith(("//","#","/*","*")): continue
        normalized=re.sub(r"\s+"," ",s)
        if len(normalized) < 4: continue
        tokens.append(hashlib.sha256(normalized.encode("utf-8")).hexdigest()[:16])
    return sorted(set(tokens))

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--inventory",required=True); ap.add_argument("--output",required=True); ns=ap.parse_args()
    try:
        data=json.load(open(ns.inventory,encoding="utf-8"))
        for c in data.get("conflicts",[]):
            c["side_signatures"]={"ours":signatures(c.get("ours","")),"theirs":signatures(c.get("theirs",""))}
        Path(ns.output).write_text(json.dumps(data,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
        print(json.dumps({"status":"ok","conflicts":len(data.get('conflicts',[]))})); return 0
    except Exception as e:
        print(json.dumps({"status":"error","error":str(e)})); return 1
if __name__=="__main__": sys.exit(main())
