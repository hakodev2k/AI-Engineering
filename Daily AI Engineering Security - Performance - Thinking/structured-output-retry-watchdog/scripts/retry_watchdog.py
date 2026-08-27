#!/usr/bin/env python3
import argparse, hashlib, json, sys, time
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"input_error:{exc}", file=sys.stderr)
        raise SystemExit(2)


def canonical_signature(event):
    payload = event.get("payload")
    error = str(event.get("validation_error", "")).strip().lower()
    schema = str(event.get("schema_id", "unknown"))
    normalized = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False) if payload is not None else "<none>"
    material = f"{schema}|{error}|{normalized}"
    return hashlib.sha256(material.encode("utf-8")).hexdigest()[:16]


def decide(event, policy, now=None):
    now = now or time.time()
    history = event.get("history", [])
    sig = canonical_signature(event)
    same = sum(1 for h in history if h.get("signature") == sig)
    total = len(history)
    last_progress = float(event.get("last_progress_epoch", now))
    no_progress = max(0.0, now - last_progress)
    max_same = int(policy.get("max_same_failure_retries", 2))
    max_total = int(policy.get("max_total_retries_per_stage", 4))
    max_idle = float(policy.get("max_no_progress_seconds", 120))
    recovery_evidence = bool(event.get("recovery_evidence"))

    if no_progress > max_idle:
        return {"decision": "fail-partial", "reason": "no_progress_deadline", "signature": sig, "same_failure_count": same, "total_retries": total}
    if same >= max_same:
        return {"decision": "fail-partial", "reason": "same_failure_retry_cap", "signature": sig, "same_failure_count": same, "total_retries": total}
    if total >= max_total:
        return {"decision": "stop", "reason": "stage_retry_budget_exhausted", "signature": sig, "same_failure_count": same, "total_retries": total}
    if policy.get("require_recovery_evidence_before_retry", True) and same > 0 and not recovery_evidence:
        return {"decision": "recover", "reason": "recovery_evidence_required", "signature": sig, "same_failure_count": same, "total_retries": total}
    return {"decision": "retry", "reason": "within_bounded_budget", "signature": sig, "same_failure_count": same, "total_retries": total}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--event", required=True)
    ap.add_argument("--policy", required=True)
    args = ap.parse_args()
    event = load_json(args.event)
    policy = load_json(args.policy)
    result = decide(event, policy)
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["decision"] in {"retry", "recover"} else 3


if __name__ == "__main__":
    raise SystemExit(main())
