#!/usr/bin/env python3
import argparse, json
from pathlib import Path

def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}")

def backoff_ms(attempt, policy):
    base = int(policy.get("base_backoff_ms", 250))
    cap = int(policy.get("max_backoff_ms", 2000))
    return min(cap, base * (2 ** max(0, attempt - 1)))

def evaluate(event, policy):
    required = ("transport", "phase", "attempt")
    missing = [k for k in required if k not in event]
    if missing:
        return {"ok": False, "state": "failed", "action": "stop", "reasons": [f"missing:{k}" for k in missing]}
    attempt = int(event["attempt"])
    max_attempts = int(policy.get("max_attempts", 3))
    code = str(event.get("error_code", ""))
    http_status = event.get("http_status")
    process_alive = event.get("process_alive")
    health_probe_ok = bool(event.get("health_probe_ok", False))
    terminal = set(policy.get("terminal_error_codes", []))
    retry_codes = set(policy.get("retry_error_codes", []))
    retry_http = set(policy.get("retry_http_statuses", [500, 502, 503, 504]))
    if event["phase"] in ("ready", "tool_call_success"):
        return {"ok": True, "state": "ready", "action": "continue", "attempt": attempt}
    if code in terminal or (isinstance(http_status, int) and http_status in (401, 403)):
        return {"ok": False, "state": "failed", "action": "stop", "attempt": attempt, "reasons": ["terminal_error"]}
    retryable = False
    reasons = []
    if isinstance(http_status, int) and http_status in retry_http:
        retryable = True
        reasons.append("transient_http")
    if code in retry_codes:
        retryable = True
        reasons.append("retryable_error_code")
    if event["transport"] == "stdio" and code in ("stale_process_handle", "process_exited"):
        if process_alive is True or health_probe_ok:
            retryable = True
            reasons.append("liveness_contradicts_terminal_failure")
        elif process_alive is False and not health_probe_ok:
            return {"ok": False, "state": "failed", "action": "stop", "attempt": attempt, "reasons": ["confirmed_process_dead"]}
    if retryable and attempt < max_attempts:
        return {"ok": False, "state": "degraded", "action": "retry", "attempt": attempt, "next_attempt": attempt + 1, "backoff_ms": backoff_ms(attempt, policy), "reasons": sorted(set(reasons))}
    if retryable:
        return {"ok": False, "state": "failed", "action": "stop", "attempt": attempt, "reasons": ["retry_budget_exhausted"] + sorted(set(reasons))}
    return {"ok": False, "state": "failed", "action": "stop", "attempt": attempt, "reasons": ["unclassified_nonretryable_error"]}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--event", required=True)
    ap.add_argument("--policy", required=True)
    args = ap.parse_args()
    try:
        result = evaluate(load_json(args.event), load_json(args.policy))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"ok": False, "state": "failed", "action": "stop", "reasons": [str(exc)]}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["state"] == "ready" else (4 if result["action"] == "retry" else 3)

if __name__ == "__main__":
    raise SystemExit(main())
