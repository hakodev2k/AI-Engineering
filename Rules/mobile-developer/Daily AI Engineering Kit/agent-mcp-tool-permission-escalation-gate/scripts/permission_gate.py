#!/usr/bin/env python3
import argparse, json, sys, time
from pathlib import Path

APPROVAL_ACTIONS={"write_external","delete","deploy","secret_access","permission_change","production_mutation"}
VALID_RISKS={"low","medium","high","critical"}

def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"input error: {exc}", file=sys.stderr); sys.exit(2)

def reject(msg, req):
    print(json.dumps({"status":"denied","request_id":req.get("request_id"),"reason":msg}, indent=2)); sys.exit(3)

def main():
    p=argparse.ArgumentParser(description="Deterministic least-privilege gate for MCP/tool requests")
    p.add_argument("request")
    p.add_argument("--approved", action="store_true", help="Human approval has been independently recorded")
    p.add_argument("--approval-id")
    p.add_argument("--max-elevation-minutes", type=int, default=30)
    a=p.parse_args(); req=load_json(a.request)
    required=["request_id","tool","action","risk","resources","reason"]
    missing=[x for x in required if not req.get(x)]
    if missing: reject("missing required fields: "+", ".join(missing), req)
    if req["risk"] not in VALID_RISKS: reject("invalid risk", req)
    resources=req["resources"]
    if not isinstance(resources,list) or not resources: reject("resources must be a non-empty list", req)
    if any(r.strip() in {"*","/**","all","ALL"} for r in resources if isinstance(r,str)): reject("wildcard resource scope forbidden", req)
    if req["action"] in APPROVAL_ACTIONS:
        if not a.approved or not a.approval_id: reject("explicit human approval required", req)
        minutes=int(req.get("requested_minutes", a.max_elevation_minutes))
        if minutes<1 or minutes>a.max_elevation_minutes: reject("elevation duration exceeds policy", req)
    result={
      "status":"allowed",
      "request_id":req["request_id"],
      "tool":req["tool"],
      "action":req["action"],
      "resources":resources,
      "approval_id":a.approval_id,
      "evaluated_at_epoch":int(time.time())
    }
    print(json.dumps(result, indent=2))

if __name__=="__main__": main()
