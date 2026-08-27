#!/usr/bin/env python3
import argparse, hashlib, json, re, sys
from pathlib import Path

OVERFLOW_PATTERNS = [
    r"context(?: window| length)?.*(?:exceed|too long|limit)",
    r"input length .* exceeds .* maximum",
    r"maximum (?:allowed )?input length",
    r"too many tokens",
    r"prompt is too long"
]

def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot load {path}: {exc}")

def signature(event):
    material = json.dumps({
        "input_tokens": event.get("input_tokens"),
        "reserved_output_tokens": event.get("reserved_output_tokens"),
        "immutable_tokens": event.get("immutable_tokens"),
        "provider_error": event.get("provider_error", "")[:500]
    }, sort_keys=True).encode()
    return hashlib.sha256(material).hexdigest()[:16]

def classify(event, policy):
    required = {"input_tokens", "immutable_tokens", "compaction_attempts", "same_signature_retries"}
    missing = sorted(required - set(event))
    if missing:
        return {"ok": False, "decision": "block", "reasons": ["missing:" + x for x in missing]}
    limit = int(event.get("context_limit_tokens", policy["context_limit_tokens"]))
    reserve = int(event.get("reserved_output_tokens", policy["reserved_output_tokens"]))
    margin = int(policy.get("safety_margin_tokens", 0))
    usable = limit - reserve - margin
    inp = int(event["input_tokens"])
    immutable = int(event["immutable_tokens"])
    err = str(event.get("provider_error", ""))
    explicit_overflow = any(re.search(p, err, flags=re.I|re.S) for p in OVERFLOW_PATTERNS)
    preflight_overflow = inp > usable
    zero_output_signal = int(event.get("output_tokens", 1)) == 0 and inp >= usable
    overflow = explicit_overflow or preflight_overflow or zero_output_signal
    result = {"ok": True, "decision": "proceed", "signature": signature(event), "usable_input_tokens": usable, "overflow": overflow}
    if not overflow:
        return result
    if immutable > usable and policy.get("fail_if_immutable_context_cannot_fit", True):
        return {**result, "ok": False, "decision": "fail_fast", "reason": "immutable_context_exceeds_budget"}
    if int(event["same_signature_retries"]) >= int(policy.get("max_same_signature_retries", 1)):
        return {**result, "ok": False, "decision": "fail_fast", "reason": "same_oversized_request_repeated"}
    attempts = int(event["compaction_attempts"])
    if attempts >= int(policy.get("max_compaction_attempts", 2)):
        return {**result, "ok": False, "decision": "fail_fast", "reason": "compaction_budget_exhausted"}
    prev = event.get("previous_input_tokens")
    if prev is not None and attempts > 0:
        reduction = int(prev) - inp
        required = max(int(policy.get("minimum_progress_tokens", 512)), int(int(prev) * float(policy.get("minimum_progress_ratio", 0.01))))
        if reduction < required:
            return {**result, "ok": False, "decision": "fail_fast", "reason": "compaction_not_making_progress", "reduction_tokens": reduction, "required_reduction_tokens": required}
    target = max(0, usable - immutable)
    return {**result, "ok": False, "decision": "compact_then_recheck", "reason": "context_overflow", "evictable_budget_tokens": target}

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--event", required=True); p.add_argument("--policy", required=True)
    a=p.parse_args()
    try:
        r=classify(load(a.event), load(a.policy)); print(json.dumps(r, indent=2, sort_keys=True))
        return 0 if r["decision"]=="proceed" else (3 if r["decision"]=="compact_then_recheck" else 4)
    except Exception as exc:
        print(str(exc), file=sys.stderr); return 2

if __name__=="__main__": raise SystemExit(main())
