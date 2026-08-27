#!/usr/bin/env python3
import argparse,json
from pathlib import Path
REQ={"attempt","input_tokens","context_limit","reserved_output_tokens","previous_input_tokens","failure_fingerprint","previous_failure_fingerprint","durable_retry_debris_tokens"}
def load(p):
 o=json.loads(Path(p).read_text(encoding="utf-8"))
 if not isinstance(o,dict): raise ValueError("JSON object required")
 return o
def n(o,k):
 v=o[k]
 if isinstance(v,bool) or not isinstance(v,int) or v<0: raise ValueError(f"{k} must be non-negative integer")
 return v
def evaluate(s,p):
 miss=sorted(REQ-s.keys())
 if miss:return {"ok":False,"decision":"block_invalid_state","reasons":["missing:"+x for x in miss]}
 try:
  attempt=n(s,"attempt"); current=n(s,"input_tokens"); limit=n(s,"context_limit"); reserve=n(s,"reserved_output_tokens"); previous=n(s,"previous_input_tokens"); debris=n(s,"durable_retry_debris_tokens")
 except ValueError as e:return {"ok":False,"decision":"block_invalid_state","reasons":[str(e)]}
 reasons=[]; free=limit-current-reserve; shrink=previous-current
 if attempt>=int(p.get("max_attempts",2)):reasons.append("attempt_limit_reached")
 if free<int(p.get("min_free_tokens",2048)):reasons.append("insufficient_reserved_headroom")
 if attempt>0 and shrink<int(p.get("min_shrink_tokens",1024)):reasons.append("retry_not_monotonically_smaller")
 if debris>int(p.get("max_retry_debris_tokens",256)):reasons.append("durable_retry_debris_exceeds_budget")
 same=bool(s["failure_fingerprint"]) and s["failure_fingerprint"]==s["previous_failure_fingerprint"]
 if attempt>0 and p.get("require_failure_fingerprint_change",True) and same:reasons.append("identical_failure_fingerprint")
 metrics={"free_tokens":free,"shrink_tokens":shrink,"retry_debris_tokens":debris}
 if reasons:return {"ok":False,"decision":"stop_and_continue_fresh","reasons":sorted(set(reasons)),"metrics":metrics}
 return {"ok":True,"decision":"allow_retry","reasons":[],"metrics":metrics}
def main():
 ap=argparse.ArgumentParser(); ap.add_argument("--state",required=True); ap.add_argument("--policy",required=True); a=ap.parse_args()
 try:r=evaluate(load(a.state),load(a.policy))
 except Exception as e: print(json.dumps({"ok":False,"decision":"block_invalid_state","reasons":[str(e)]})); return 2
 print(json.dumps(r,indent=2,sort_keys=True)); return 0 if r["ok"] else 3
if __name__=="__main__": raise SystemExit(main())
