#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

CALL_TYPES = {"custom_tool_call", "function_call", "tool_call"}
OUTPUT_TYPES = {"custom_tool_call_output", "function_call_output", "tool_call_output"}


def iter_jsonl(path):
    with open(path, encoding="utf-8") as handle:
        for line_no, line in enumerate(handle, 1):
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"{path}:{line_no}: invalid JSON: {exc}") from exc
            if not isinstance(obj, dict):
                raise ValueError(f"{path}:{line_no}: expected object")
            yield line_no, obj


def call_id(obj):
    return obj.get("call_id") or obj.get("id")


def scan(path):
    calls = {}
    outputs = {}
    duplicate_calls = []
    duplicate_outputs = []

    for line_no, obj in iter_jsonl(path):
        item_type = obj.get("type")
        if item_type in CALL_TYPES:
            cid = call_id(obj)
            if not cid:
                raise ValueError(f"{path}:{line_no}: tool call missing call_id/id")
            if cid in calls:
                duplicate_calls.append(cid)
            calls[cid] = {"line": line_no, "name": obj.get("name"), "status": obj.get("status")}
        elif item_type in OUTPUT_TYPES:
            cid = call_id(obj)
            if not cid:
                raise ValueError(f"{path}:{line_no}: tool output missing call_id/id")
            if cid in outputs:
                duplicate_outputs.append(cid)
            outputs[cid] = {"line": line_no, "status": obj.get("status")}

    return {
        "calls": len(calls),
        "outputs": len(outputs),
        "orphan_calls": [{"call_id": cid, **value} for cid, value in calls.items() if cid not in outputs],
        "orphan_outputs": [{"call_id": cid, **value} for cid, value in outputs.items() if cid not in calls],
        "duplicate_calls": sorted(set(duplicate_calls)),
        "duplicate_outputs": sorted(set(duplicate_outputs)),
    }


def main():
    parser = argparse.ArgumentParser(description="Validate persisted tool-call/result journal atomicity.")
    parser.add_argument("--journal", required=True, help="Journal JSONL file")
    parser.add_argument("--mode", choices=["check", "recovery-plan"], default="check")
    parser.add_argument("--out", help="Optional path for JSON report/recovery plan")
    args = parser.parse_args()

    try:
        report = scan(args.journal)
    except (OSError, ValueError) as exc:
        print(f"input_error: {exc}", file=sys.stderr)
        return 2

    bad = any(report[key] for key in ("orphan_calls", "orphan_outputs", "duplicate_calls", "duplicate_outputs"))
    report["status"] = "fail" if bad else "pass"

    if args.mode == "recovery-plan":
        plan = {
            "journal": args.journal,
            "status": "blocked" if bad else "clear",
            "actions": [],
            "rule": "Never synthesize successful tool output. Orphaned side-effecting calls are indeterminate until reconciled against the external system.",
        }
        for orphan in report["orphan_calls"]:
            plan["actions"].append({
                "call_id": orphan["call_id"],
                "classification": "indeterminate",
                "action": "reconcile_external_state_then_record_explicit_result_or_aborted_marker",
            })
        for orphan in report["orphan_outputs"]:
            plan["actions"].append({
                "call_id": orphan["call_id"],
                "classification": "journal_corruption",
                "action": "quarantine_and_rebuild_from_authoritative_log",
            })
        payload = {"report": report, "recovery_plan": plan}
    else:
        payload = report

    text = json.dumps(payload, indent=2)
    if args.out:
        try:
            Path(args.out).write_text(text + "\n", encoding="utf-8")
        except OSError as exc:
            print(f"output_error: {exc}", file=sys.stderr)
            return 2
    print(text)
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
