#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description="Build a deterministic resume summary from checkpoint state.")
    parser.add_argument("--checkpoint", default=".agent-state/checkpoint-state.json")
    args = parser.parse_args()

    path = Path(args.checkpoint)
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"ERROR: cannot load checkpoint: {exc}", file=sys.stderr)
        raise SystemExit(1)

    stages = data.get("stages", [])
    current = data.get("current_stage")
    stage = next((s for s in stages if s.get("id") == current), None)
    pending = [a for a in data.get("approvals", []) if a.get("required") and a.get("status") == "pending"]
    unresolved = [f for f in data.get("failures", []) if not f.get("resolved", False)]
    last_event = data.get("events", [])[-1] if data.get("events") else None

    print(f"Task: {data.get('task_id', '<unknown>')}")
    print(f"Status: {data.get('status', '<unknown>')}")
    print(f"Objective: {data.get('objective', '')}")
    print(f"Current stage: {current} - {(stage or {}).get('name', '<unknown>')}")
    print(f"Next action: {data.get('next_action', '')}")
    print(f"Pending approvals: {len(pending)}")
    print(f"Unresolved failures: {len(unresolved)}")
    if last_event:
        print(f"Last event: {last_event.get('action', '<unknown>')} -> {last_event.get('result', '<unknown>')}")
    baseline = data.get("baseline", {})
    if baseline.get("git_commit"):
        print(f"Baseline commit: {baseline['git_commit']}")
    changed = data.get("changed_resources", [])
    print(f"Recorded changed resources: {len(changed)}")

    if pending:
        print("Resume decision hint: BLOCKED_PENDING_APPROVAL")
    elif unresolved:
        print("Resume decision hint: RECONCILE_FAILURES")
    elif data.get("status") == "verified":
        print("Resume decision hint: ALREADY_VERIFIED")
    else:
        print("Resume decision hint: RECONCILE_STATE_THEN_CONTINUE")


if __name__ == "__main__":
    main()
