#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

def canonical(v): return json.dumps(v, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()

def main():
    p=argparse.ArgumentParser(); p.add_argument("--revision", required=True); p.add_argument("--base-revision", required=True); p.add_argument("--file", action="append", default=[]); p.add_argument("--value", action="append", default=[]); p.add_argument("--output")
    a=p.parse_args(); files=[]
    for raw in sorted(set(a.file)):
        path=Path(raw)
        if not path.is_file(): print(f"missing input file: {raw}", file=sys.stderr); return 2
        files.append({"path":raw,"sha256":hashlib.sha256(path.read_bytes()).hexdigest()})
    values=[]
    for item in sorted(a.value):
        if "=" not in item: print("--value must be key=value", file=sys.stderr); return 2
        k,v=item.split("=",1); values.append({"key":k,"value":v})
    payload={"source_revision":a.revision,"base_revision":a.base_revision,"files":files,"values":values}
    out={"input_fingerprint":hashlib.sha256(canonical(payload)).hexdigest(),"inputs":payload}
    text=json.dumps(out,indent=2)
    Path(a.output).write_text(text+"\n",encoding="utf-8") if a.output else print(text)
    return 0
if __name__=="__main__": raise SystemExit(main())