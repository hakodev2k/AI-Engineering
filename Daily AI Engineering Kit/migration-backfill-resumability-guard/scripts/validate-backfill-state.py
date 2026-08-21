#!/usr/bin/env python3
import argparse, hashlib, json, sys
from datetime import datetime, timezone

def canon(v): return json.dumps(v,sort_keys=True,separators=(",",":"),ensure_ascii=False)
def iso(v):
    if v.endswith("Z"): v=v[:-1]+"+00:00"
    return datetime.fromisoformat(v).astimezone(timezone.utc)

def main():
    p=argparse.ArgumentParser(); p.add_argument("--plan",required=True); p.add_argument("--checkpoint",required=True); p.add_argument("--policy",required=True); p.add_argument("--output")
    a=p.parse_args(); errors=[]
    try:
        plan=json.load(open(a.plan,encoding="utf-8")); cp=json.load(open(a.checkpoint,encoding="utf-8")); policy=json.load(open(a.policy,encoding="utf-8"))
        identity={k:plan.get(k) for k in ["migration_id","revision","environment","source","predicate","ordering_key","transform_fingerprint","chunk_size","idempotency_strategy","verification"]}
        expected=hashlib.sha256(canon(identity).encode()).hexdigest()
        if plan.get("plan_fingerprint")!=expected: errors.append("plan-fingerprint-invalid")
        if cp.get("plan_fingerprint")!=expected: errors.append("checkpoint-plan-fingerprint-mismatch")
        if cp.get("migration_id")!=plan.get("migration_id") or cp.get("revision")!=plan.get("revision"): errors.append("checkpoint-identity-mismatch")
        if int(plan.get("chunk_size",0))<1 or int(plan.get("chunk_size",0))>int(policy.get("max_chunk_size",5000)): errors.append("chunk-size-out-of-policy")
        if policy.get("require_idempotency_key",True) and plan.get("idempotency_strategy") not in ["upsert","compare-and-set","dedupe-key","no-op-if-complete"]: errors.append("idempotency-strategy-invalid")
        if int(cp.get("processed_total",-1))<0 or int(cp.get("checkpoint_version",-1))<0: errors.append("checkpoint-counters-invalid")
        iso(cp["updated_at"]); iso(cp["lease_expires_at"])
        out={"status":"valid" if not errors else "blocked","errors":errors,"plan_fingerprint":expected}
        if a.output: json.dump(out,open(a.output,"w",encoding="utf-8"),indent=2); open(a.output,"a",encoding="utf-8").write("\n")
        else: print(json.dumps(out,indent=2))
        return 0 if not errors else 3
    except Exception as e:
        print(f"error: {e}",file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())
