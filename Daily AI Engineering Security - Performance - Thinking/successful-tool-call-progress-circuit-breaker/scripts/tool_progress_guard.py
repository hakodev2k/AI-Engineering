#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

READ_ONLY={"read_file","grep","search","web_search","git_log"}
MUTATING={"write_file","shell","git_push","deploy","delete","http_write"}
MAX_IDENTICAL=2
MAX_SAME_PROGRESS=3

def canon(v): return json.dumps(v,sort_keys=True,separators=(",",":"),ensure_ascii=False)
def fp(tool,args): return hashlib.sha256(canon({"tool":tool,"args":args}).encode()).hexdigest()

def load_json(path):
    try:return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e: raise ValueError(f"cannot read JSON {path}: {e}")

def load_jsonl(path):
    rows=[]
    try:
        for i,line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(),1):
            if not line.strip(): continue
            try: rows.append(json.loads(line))
            except Exception as e: raise ValueError(f"{path}:{i}: {e}")
    except OSError as e: raise ValueError(f"cannot read history {path}: {e}")
    return rows

def evaluate(history,candidate):
    if not isinstance(candidate,dict): raise ValueError("candidate must be an object")
    tool=candidate.get("tool"); args=candidate.get("args")
    if not isinstance(tool,str) or not tool: raise ValueError("candidate.tool must be non-empty")
    if args is None: raise ValueError("candidate.args is required")
    fingerprint=fp(tool,args)
    successes=[r for r in history if r.get("status")=="success" and r.get("tool")==tool and fp(tool,r.get("args"))==fingerprint]
    if len(successes)>=MAX_IDENTICAL:
        if tool in READ_ONLY:
            return {"ok":True,"decision":"replay","reason":"identical_successful_read_only_call","cached_result":successes[-1].get("result"),"fingerprint":fingerprint,"prior_successes":len(successes)}
        if tool in MUTATING:
            return {"ok":False,"decision":"block","reason":"repeated_mutating_call_requires_review","fingerprint":fingerprint,"prior_successes":len(successes)}
        return {"ok":False,"decision":"block","reason":"identical_success_threshold_exceeded","fingerprint":fingerprint,"prior_successes":len(successes)}
    key=candidate.get("expected_progress_key")
    if key:
        val=candidate.get("last_observed_value")
        same=sum(1 for r in history if r.get("tool")==tool and r.get("status")=="success" and r.get("progress",{}).get(key)==val)
        if same>=MAX_SAME_PROGRESS:
            return {"ok":False,"decision":"block","reason":"no_progress_threshold_exceeded","fingerprint":fingerprint,"prior_same_progress_values":same}
    return {"ok":True,"decision":"execute","reason":"below_repeat_threshold","fingerprint":fingerprint,"prior_successes":len(successes)}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--history",required=True); ap.add_argument("--candidate",required=True); a=ap.parse_args()
    try:r=evaluate(load_jsonl(a.history),load_json(a.candidate))
    except ValueError as e: print(json.dumps({"ok":False,"error":str(e)})); return 2
    print(json.dumps(r,indent=2,sort_keys=True,ensure_ascii=False)); return 0 if r["ok"] else 3
if __name__=="__main__": raise SystemExit(main())
