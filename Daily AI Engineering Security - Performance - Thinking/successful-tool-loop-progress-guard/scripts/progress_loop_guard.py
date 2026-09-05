#!/usr/bin/env python3
"""Detect repeated successful tool cycles with no observable progress."""
import hashlib,json,sys
from pathlib import Path

def load_json(path):
 try: return json.loads(Path(path).read_text(encoding="utf-8"))
 except (OSError,json.JSONDecodeError) as exc: raise ValueError(str(exc))
def signature(event):
 for k in ("action","target","result"):
  if k not in event: raise ValueError(f"event missing {k}")
 raw=json.dumps([event["action"],event["target"],event["result"]],sort_keys=True,separators=(",",":"))
 return hashlib.sha256(raw.encode()).hexdigest()[:16]
def detect(events,window,max_cycles):
 if window<2 or max_cycles<2: raise ValueError("window and max_identical_cycles must be >= 2")
 recent=events[-window:]; last_progress=None; streak=0; prev=None
 for e in recent:
  if not isinstance(e,dict) or "progress" not in e: raise ValueError("each event must contain progress")
  sig=signature(e); marker=json.dumps(e["progress"],sort_keys=True)
  if marker!=last_progress: streak=1
  elif sig==prev: streak+=1
  else: streak=1
  last_progress=marker; prev=sig
  if streak>=max_cycles: return {"blocked":True,"signature":sig,"cycles":streak,"progress":e["progress"]}
 return {"blocked":False,"cycles":streak}
def main(argv):
 if len(argv)!=3: print(f"usage: {argv[0]} <guard.json> <events.jsonl>",file=sys.stderr); return 1
 try:
  cfg=load_json(argv[1]); window=int(cfg.get("window",8)); maximum=int(cfg.get("max_identical_cycles",3)); events=[]
  for n,line in enumerate(Path(argv[2]).read_text(encoding="utf-8").splitlines(),1):
   if line.strip():
    try: events.append(json.loads(line))
    except json.JSONDecodeError as exc: raise ValueError(f"line {n}: {exc}")
  result=detect(events,window,maximum)
 except (OSError,ValueError,TypeError) as exc: print(f"ERROR: {exc}",file=sys.stderr); return 1
 print(json.dumps(result,sort_keys=True)); return 4 if result["blocked"] else 0
if __name__=="__main__": sys.exit(main(sys.argv))
