#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

TERMINAL = {"completed", "failed", "cancelled", "stalled"}


def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"cannot_read:{exc}"}))
        raise SystemExit(2)


def evaluate(state, policy):
    now = int(state.get("now_ms", 0))
    children = state.get("children")
    if now <= 0 or not isinstance(children, list) or not children:
        return {"ok": False, "decision": "block", "reasons": ["invalid_state"]}

    wall = int(policy.get("wall_timeout_ms", 900000))
    idle = int(policy.get("idle_progress_timeout_ms", 180000))
    minimum = int(policy.get("minimum_successes", len(children)))
    results = []

    for child in children:
        cid = str(child.get("id", "unknown"))
        status = str(child.get("status", "running"))
        started = int(child.get("started_ms", now))
        progress = int(child.get("last_progress_ms", started))
        reason = None
        if status not in TERMINAL:
            if now - started > wall:
                status, reason = "stalled", "wall_timeout"
            elif now - progress > idle:
                status, reason = "stalled", "idle_progress_timeout"
        results.append({"id": cid, "status": status, "reason": reason})

    completed = sum(1 for r in results if r["status"] == "completed")
    pending = sum(1 for r in results if r["status"] not in TERMINAL)
    stalled = [r["id"] for r in results if r["status"] == "stalled"]

    if completed >= minimum:
        decision = "release_degraded" if stalled else "release"
        return {"ok": True, "decision": decision, "completed": completed,
                "minimum_successes": minimum, "children": results}
    if completed + pending < minimum:
        return {"ok": False, "decision": "block", "completed": completed,
                "minimum_successes": minimum, "children": results,
                "reasons": ["quorum_unreachable"]}
    return {"ok": True, "decision": "wait_bounded", "completed": completed,
            "minimum_successes": minimum, "children": results}


def main():
    ap = argparse.ArgumentParser(description="Evaluate a multi-agent barrier with bounded progress deadlines.")
    ap.add_argument("--state", required=True)
    ap.add_argument("--policy", required=True)
    args = ap.parse_args()
    result = evaluate(load(args.state), load(args.policy))
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    sys.exit(main())
