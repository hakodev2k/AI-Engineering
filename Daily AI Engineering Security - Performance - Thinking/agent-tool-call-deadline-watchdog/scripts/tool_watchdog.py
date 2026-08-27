#!/usr/bin/env python3
import argparse, json, sys, time
from pathlib import Path

REQUIRED = {"call_id", "tool", "started_ms", "side_effect", "idempotent", "attempt"}

def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot load {path}: {exc}")

def classify(event, policy, now_ms):
    missing = sorted(REQUIRED - set(event))
    if missing:
        return {"ok": False, "decision": "block", "reasons": ["missing:" + x for x in missing]}
    if not isinstance(event["started_ms"], (int, float)) or event["started_ms"] < 0:
        return {"ok": False, "decision": "block", "reasons": ["invalid_started_ms"]}
    elapsed = max(0, int(now_ms - event["started_ms"]))
    kind = event.get("deadline_class", "default")
    key = {"validation":"validation_deadline_ms","network":"network_deadline_ms","long_running":"long_running_deadline_ms"}.get(kind,"default_deadline_ms")
    deadline = int(policy.get(key, policy.get("default_deadline_ms", 60000)))
    grace = int(policy.get("stale_grace_ms", 0))
    stale = elapsed > deadline + grace
    result = {"ok": True, "decision": "observe", "call_id": event["call_id"], "tool": event["tool"], "elapsed_ms": elapsed, "deadline_ms": deadline, "stale": stale}
    if not stale:
        return result
    attempts = int(event["attempt"])
    max_attempts = int(policy.get("max_total_attempts", 2))
    consequential = str(event["side_effect"]).lower() not in {"none", "read"}
    retry_safe = bool(event["idempotent"]) and not consequential and attempts < max_attempts
    total_wall = int(event.get("total_wall_ms", elapsed))
    if total_wall >= int(policy.get("max_total_wall_ms", 360000)):
        retry_safe = False
    if retry_safe:
        result.update({"decision":"cancel_and_retry_once", "retry_allowed": True})
    else:
        result.update({"ok": False, "decision":"cancel_and_escalate", "retry_allowed": False})
        if consequential:
            result["reason"] = "consequential_side_effect_requires_review"
        elif attempts >= max_attempts:
            result["reason"] = "attempt_budget_exhausted"
        else:
            result["reason"] = "retry_not_proven_safe"
    return result

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--event", required=True)
    p.add_argument("--policy", required=True)
    p.add_argument("--now-ms", type=int)
    a = p.parse_args()
    try:
        event, policy = load(a.event), load(a.policy)
        now = a.now_ms if a.now_ms is not None else int(time.monotonic() * 1000)
        r = classify(event, policy, now)
        print(json.dumps(r, indent=2, sort_keys=True))
        return 0 if r["decision"] == "observe" else (3 if r.get("retry_allowed") else 4)
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 2

if __name__ == "__main__":
    raise SystemExit(main())
