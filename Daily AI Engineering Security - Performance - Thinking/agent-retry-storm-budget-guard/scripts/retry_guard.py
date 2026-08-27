#!/usr/bin/env python3
"""Task-scoped retry-budget decision engine for AI-agent calls."""
from __future__ import annotations
import argparse, json, random
from pathlib import Path


def evaluate(event: dict, policy: dict, rng=None) -> dict:
    rng = rng or random.Random()
    required = ["status", "operation_attempt", "task_retry_count", "elapsed_ms", "idempotent", "consecutive_endpoint_failures"]
    missing = [k for k in required if k not in event]
    if missing:
        return {"decision":"fail_fast","reason":"missing:" + ",".join(missing)}
    status = int(event["status"])
    if int(event["consecutive_endpoint_failures"]) >= int(policy["circuit_failure_threshold"]):
        return {"decision":"circuit_open","delay_ms":int(policy["circuit_open_ms"]),"reason":"endpoint_failure_threshold"}
    if int(event["task_retry_count"]) >= int(policy["task_retry_budget"]):
        return {"decision":"fail_fast","reason":"task_retry_budget_exhausted"}
    if int(event["operation_attempt"]) >= int(policy["operation_retry_budget"]):
        return {"decision":"fail_fast","reason":"operation_retry_budget_exhausted"}
    if int(event["elapsed_ms"]) >= int(policy["max_elapsed_ms"]):
        return {"decision":"fail_fast","reason":"elapsed_budget_exhausted"}
    if status in set(policy.get("non_retryable_statuses", [])):
        return {"decision":"fail_fast","reason":"non_retryable_status"}
    if status not in set(policy.get("retryable_statuses", [])):
        return {"decision":"fail_fast","reason":"status_not_retryable"}
    if policy.get("require_idempotent_for_retry", True) and not bool(event["idempotent"]):
        return {"decision":"fail_fast","reason":"non_idempotent_operation"}
    if policy.get("respect_retry_after", True) and event.get("retry_after_ms") is not None:
        delay = min(int(event["retry_after_ms"]), int(policy["max_delay_ms"]))
    else:
        cap = min(int(policy["max_delay_ms"]), int(policy["base_delay_ms"]) * (2 ** int(event["operation_attempt"])))
        delay = int(rng.uniform(0, max(1, cap)))
    return {"decision":"retry","delay_ms":delay,"reason":"transient_within_budget"}


def main() -> int:
    ap=argparse.ArgumentParser(); ap.add_argument("--event",required=True); ap.add_argument("--policy",required=True); a=ap.parse_args()
    try:
        event=json.loads(Path(a.event).read_text(encoding="utf-8")); policy=json.loads(Path(a.policy).read_text(encoding="utf-8")); result=evaluate(event,policy)
    except Exception as exc:
        print(json.dumps({"decision":"fail_fast","reason":f"guard_error:{exc}"})); return 2
    print(json.dumps(result,indent=2,sort_keys=True)); return {"retry":0,"fail_fast":3,"circuit_open":4}.get(result["decision"],2)

if __name__=="__main__": raise SystemExit(main())
