#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

VALID_STATUSES = {"planned", "running", "blocked", "completed", "verified", "abandoned"}
VALID_STAGE_STATUSES = {"pending", "running", "completed", "blocked", "failed"}


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate resumable-agent checkpoint state.")
    parser.add_argument("--checkpoint", default=".agent-state/checkpoint-state.json")
    args = parser.parse_args()

    path = Path(args.checkpoint)
    if not path.is_file():
        fail(f"checkpoint not found: {path}")

    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"cannot read checkpoint: {exc}")

    required = ["version", "task_id", "objective", "status", "baseline", "stages", "current_stage", "events", "failures", "approvals", "next_action", "verification"]
    for key in required:
        if key not in data:
            fail(f"missing required field: {key}")

    if data["status"] not in VALID_STATUSES:
        fail(f"invalid status: {data['status']}")

    stages = data["stages"]
    if not isinstance(stages, list) or not stages:
        fail("stages must be a non-empty array")

    ids = []
    for stage in stages:
        for field in ["id", "name", "status", "completion_evidence"]:
            if field not in stage:
                fail(f"stage missing {field}")
        if stage["status"] not in VALID_STAGE_STATUSES:
            fail(f"invalid stage status for {stage['id']}")
        if stage["id"] in ids:
            fail(f"duplicate stage id: {stage['id']}")
        ids.append(stage["id"])
        if stage["status"] == "completed" and not stage["completion_evidence"]:
            fail(f"completed stage lacks evidence: {stage['id']}")

    if data["current_stage"] not in ids:
        fail("current_stage does not match any stage id")

    if not isinstance(data["events"], list) or not isinstance(data["failures"], list) or not isinstance(data["approvals"], list):
        fail("events, failures, and approvals must be arrays")

    if data["status"] == "verified":
        verification = data["verification"]
        if verification.get("result") != "verified":
            fail("task status is verified but verification.result is not verified")
        if not verification.get("evidence"):
            fail("verified task lacks verification evidence")
        incomplete = [s["id"] for s in stages if s["status"] != "completed"]
        if incomplete:
            fail(f"verified task has incomplete stages: {', '.join(incomplete)}")

    pending_required = [a for a in data["approvals"] if a.get("required") and a.get("status") == "pending"]
    if data["status"] == "verified" and pending_required:
        fail("verified task still has pending required approvals")

    if not isinstance(data["next_action"], str):
        fail("next_action must be a string")

    print(f"OK: checkpoint valid ({data['task_id']}, status={data['status']}, stage={data['current_stage']})")


if __name__ == "__main__":
    main()
