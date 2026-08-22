#!/usr/bin/env python3
"""Profile JSON/JSONL agent context for token-amplifying payloads. Python 3.9+, stdlib only."""
import argparse, hashlib, json, re, sys
from pathlib import Path
DATA=re.compile(r"data:[^;,]+;base64,[A-Za-z0-9+/=]+")

def records(path):
 text=Path(path).read_text(encoding="utf-8",errors="replace")
 if path.endswith(".jsonl"):
  for i,line in enumerate(text.splitlines(),1):
   if line.strip():
    try: yield json.loads(line)
    except json.JSONDecodeError as e: raise ValueError(f"invalid JSONL line {i}: {e}")
 else: yield json.loads(text)

def walk(x, stats, seen, key=""):
 if isinstance(x,dict):
  for k,v in x.items(): walk(v,stats,seen,k)
 elif isinstance(x,list):
  for v in x: walk(v,stats,seen,key)
 elif isinstance(x,str):
  n=len(x); stats["text_chars"]+=n
  if "tool" in key.lower() or "output" in key.lower(): stats["tool_output_chars"]+=n
  matches=DATA.findall(x); stats["data_url_count"]+=len(matches); stats["data_url_chars"]+=sum(map(len,matches))
  if n>=256:
   h=hashlib.sha256(x.encode()).hexdigest()
   if h in seen: stats["duplicate_chars"]+=n
   else: seen.add(h)

def main():
 p=argparse.ArgumentParser(); p.add_argument("input"); p.add_argument("--context-window",type=int,required=True); p.add_argument("--estimated-input-tokens",type=int); p.add_argument("--compactions",type=int,default=0); p.add_argument("--turns",type=int,default=0); a=p.parse_args()
 stats={"text_chars":0,"tool_output_chars":0,"data_url_count":0,"data_url_chars":0,"duplicate_chars":0}; seen=set()
 try:
  for r in records(a.input): walk(r,stats,seen)
 except (OSError,ValueError,json.JSONDecodeError) as e: print(f"ERROR: {e}",file=sys.stderr); return 2
 est=a.estimated_input_tokens if a.estimated_input_tokens is not None else (stats["text_chars"]+3)//4
 stats.update({"estimated_input_tokens":est,"context_window_tokens":a.context_window,"utilization_ratio":round(est/a.context_window,4),"headroom_tokens":max(0,a.context_window-est),"compactions":a.compactions,"turns":a.turns})
 print(json.dumps(stats,indent=2)); return 0
if __name__=="__main__": sys.exit(main())
