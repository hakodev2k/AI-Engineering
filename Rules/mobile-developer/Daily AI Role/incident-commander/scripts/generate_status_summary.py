#!/usr/bin/env python3
"""Generate a factual Markdown incident summary from structured JSON state."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


def as_bullets(values: Any, empty_text: str = "- None recorded") -> str:
    if not isinstance(values, list) or not values:
        return empty_text
    lines: list[str] = []
    for value in values:
        if isinstance(value, str):
            text = value.strip()
        elif isinstance(value, dict):
            text = str(value.get("summary") or value.get("description") or value.get("goal") or value)
        else:
            text = str(value)
        if text:
            lines.append(f"- {text}")
    return "\n".join(lines) if lines else empty_text


def active_tasks(tasks: Any) -> str:
    if not isinstance(tasks, list):
        return "- None recorded"
    lines: list[str] = []
    for task in tasks:
        if not isinstance(task, dict) or task.get("state") not in {"queued", "active", "blocked"}:
            continue
        goal = str(task.get("goal", "unnamed task"))
        owner = str(task.get("owner", "unassigned"))
        state = str(task.get("state", "unknown"))
        extra = f"; blocker: {task.get('blocker')}" if state == "blocked" and task.get("blocker") else ""
        lines.append(f"- [{state}] {goal} — owner: {owner}{extra}")
    return "\n".join(lines) if lines else "- None recorded"


def build_summary(data: dict[str, Any]) -> str:
    incident_id = data.get("incident_id", "UNKNOWN")
    title = data.get("title", "Untitled incident")
    severity = data.get("severity", "UNKNOWN")
    status = data.get("status", "UNKNOWN")
    impact = data.get("impact", "Not recorded")
    checkpoint = data.get("next_checkpoint") or "Not scheduled"

    return f"""# Incident Status — {incident_id}: {title}

**Severity:** {severity}  
**Status:** {status}  
**Impact:** {impact}  
**Next checkpoint:** {checkpoint}

## Confirmed facts
{as_bullets(data.get('facts'))}

## Current response
{active_tasks(data.get('tasks'))}

## Known risks
{as_bullets(data.get('risks'))}

## Open questions
{as_bullets(data.get('unknowns'))}

> This summary is generated deterministically from recorded incident state. It does not infer root cause or recovery ETA.
"""


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate Markdown incident status from JSON state")
    parser.add_argument("state_file", type=Path)
    parser.add_argument("--output", type=Path, help="Optional output Markdown path")
    args = parser.parse_args()

    try:
        data = json.loads(args.state_file.read_text(encoding="utf-8"))
    except OSError as exc:
        print(f"ERROR: cannot read {args.state_file}: {exc}", file=sys.stderr)
        return 2
    except json.JSONDecodeError as exc:
        print(f"ERROR: invalid JSON: {exc}", file=sys.stderr)
        return 2

    if not isinstance(data, dict):
        print("ERROR: root JSON value must be an object", file=sys.stderr)
        return 2

    required = ("incident_id", "title", "severity", "status", "impact")
    missing = [field for field in required if not data.get(field)]
    if missing:
        print(f"ERROR: missing required fields: {', '.join(missing)}", file=sys.stderr)
        return 1

    summary = build_summary(data)
    if args.output:
        try:
            args.output.write_text(summary, encoding="utf-8")
        except OSError as exc:
            print(f"ERROR: cannot write {args.output}: {exc}", file=sys.stderr)
            return 2
    else:
        print(summary, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
