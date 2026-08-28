#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

REQUIRED_LIMITS = ("max_buffer_bytes", "max_active_sessions", "max_idle_session_seconds")
REQUIRED_OBS = ("role", "internet_exposed", "buffered_bytes", "active_sessions", "oldest_idle_session_seconds")

def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}")

def positive_int(value, name):
    if isinstance(value, bool) or not isinstance(value, int) or value <= 0:
        raise ValueError(f"{name} must be a positive integer")
    return value

def evaluate(observation, limits):
    missing_obs = [k for k in REQUIRED_OBS if k not in observation]
    missing_limits = [k for k in REQUIRED_LIMITS if k not in limits]
    reasons = [f"missing_observation:{k}" for k in missing_obs] + [f"missing_limit:{k}" for k in missing_limits]
    if reasons:
        return {"ok": False, "decision": "block", "reasons": reasons}
    try:
        max_buffer = positive_int(limits["max_buffer_bytes"], "max_buffer_bytes")
        max_sessions = positive_int(limits["max_active_sessions"], "max_active_sessions")
        max_idle = positive_int(limits["max_idle_session_seconds"], "max_idle_session_seconds")
        buffered = int(observation["buffered_bytes"])
        sessions = int(observation["active_sessions"])
        idle = int(observation["oldest_idle_session_seconds"])
    except (ValueError, TypeError) as exc:
        return {"ok": False, "decision": "block", "reasons": [f"invalid_input:{exc}"]}
    if min(buffered, sessions, idle) < 0:
        reasons.append("negative_runtime_metric")
    if buffered > max_buffer:
        reasons.append("buffer_limit_exceeded")
    if sessions > max_sessions:
        reasons.append("session_limit_exceeded")
    if idle > max_idle:
        reasons.append("idle_session_limit_exceeded")
    if observation["internet_exposed"] is not True and observation["internet_exposed"] is not False:
        reasons.append("internet_exposed_not_boolean")
    if str(observation["role"]) not in {"client", "server", "both"}:
        reasons.append("invalid_role")
    return {
        "ok": not reasons,
        "decision": "allow" if not reasons else "block",
        "reasons": sorted(set(reasons)),
        "metrics": {"buffered_bytes": buffered, "active_sessions": sessions, "oldest_idle_session_seconds": idle}
    }

def main():
    ap = argparse.ArgumentParser(description="Validate MCP transport resource bounds")
    ap.add_argument("--observation", required=True)
    ap.add_argument("--limits", required=True)
    args = ap.parse_args()
    try:
        result = evaluate(load_json(args.observation), load_json(args.limits))
    except ValueError as exc:
        print(json.dumps({"ok": False, "decision": "block", "reasons": [str(exc)]}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3

if __name__ == "__main__":
    sys.exit(main())
