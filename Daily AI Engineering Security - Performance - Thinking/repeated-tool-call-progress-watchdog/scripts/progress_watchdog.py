#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))

def canonical(value, ignored):
    if isinstance(value, dict):
        return {k: canonical(v, ignored) for k, v in sorted(value.items()) if k not in ignored}
    if isinstance(value, list):
        return [canonical(v, ignored) for v in value]
    return value

def fingerprint(row, ignored):
    payload={"tool":row.get("tool"),"args":canonical(row.get("args",{}),ignored)}
    raw=json.dumps(payload,sort_keys=True,separators=(",",":"),ensure_ascii=False)
    return hashlib.sha256(raw.encode()).hexdigest()[:16]

def analyze(rows, cfg):
    ignored=set(cfg.get("normalize_ignored_argument_keys",[]))
    identical=0; no_progress=0; token_run=0; last_fp=None; recoveries=0
    events=[]
    for i,row in enumerate(rows,1):
        if "tool" not in row or "args" not in row or "progress" not in row:
            return {"status":"invalid","step":i,"reason":"missing_required_field"}
        fp=fingerprint(row,ignored)
        progress=bool(row["progress"])
        tokens=int(row.get("tokens",0))
        if progress:
            identical=no_progress=token_run=0; last_fp=None
        else:
            no_progress+=1; token_run+=max(0,tokens)
            identical=identical+1 if fp==last_fp else 1
            last_fp=fp
        reason=None
        if identical>=int(cfg["max_identical_no_progress"]): reason="identical_no_progress"
        elif no_progress>=int(cfg["max_no_progress_steps"]): reason="no_progress_step_budget"
        elif token_run>=int(cfg["max_tokens_without_progress"]): reason="token_budget_without_progress"
        if reason:
            recoveries+=1
            events.append({"step":i,"action":"recover" if recoveries<=int(cfg["max_recovery_attempts"]) else "stop","reason":reason,"fingerprint":fp})
            if recoveries>int(cfg["max_recovery_attempts"]):
                return {"status":"stop","events":events,"step":i,"reason":reason}
            identical=no_progress=token_run=0; last_fp=None
    return {"status":"continue","events":events,"steps":len(rows)}

def load_trace(path):
    rows=[]
    for n,line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(),1):
        if not line.strip(): continue
        try: rows.append(json.loads(line))
        except Exception as e: raise ValueError(f"invalid JSON line {n}: {e}")
    return rows

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--trace",required=True); ap.add_argument("--config",required=True); a=ap.parse_args()
    try: result=analyze(load_trace(a.trace),load_json(a.config))
    except Exception as e: print(str(e),file=sys.stderr); return 2
    print(json.dumps(result,indent=2,sort_keys=True)); return 3 if result["status"]=="stop" else (2 if result["status"]=="invalid" else 0)
if __name__=="__main__": raise SystemExit(main())
