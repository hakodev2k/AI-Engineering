#!/usr/bin/env python3
"""Validate a canonical multi-interrupt resume envelope before framework invocation."""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path
from typing import Any

EXIT_OK = 0
EXIT_POLICY = 2
EXIT_INPUT = 3


def load_json(path: str) -> Any:
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read valid JSON from {path}: {exc}") from exc


def normalize_pending(value: Any) -> list[str]:
    if not isinstance(value, list):
        raise ValueError("pending interrupts must be a JSON array")
    ids: list[str] = []
    for idx, item in enumerate(value):
        if not isinstance(item, dict) or not isinstance(item.get("id"), str) or not item["id"].strip():
            raise ValueError(f"pending[{idx}] must contain a non-empty string id")
        ids.append(item["id"])
    if len(ids) != len(set(ids)):
        raise ValueError("pending interrupt IDs must be unique")
    return ids


def validate(pending_ids: list[str], envelope: Any) -> dict[str, Any]:
    violations: list[str] = []
    adapter_resume: Any = None

    if not isinstance(envelope, dict):
        return {"ok": False, "violations": ["resume envelope must be an object"], "adapter_resume": None}

    mode = envelope.get("mode")
    if mode == "single":
        if len(pending_ids) != 1:
            violations.append(f"single mode requires exactly one pending interrupt; found {len(pending_ids)}")
        if "value" not in envelope:
            violations.append("single mode requires value")
        else:
            adapter_resume = envelope["value"]
    elif mode == "by_id":
        responses = envelope.get("responses")
        if not isinstance(responses, dict):
            violations.append("by_id mode requires responses object")
        else:
            keys = set(responses.keys())
            pending = set(pending_ids)
            missing = sorted(pending - keys)
            unknown = sorted(keys - pending)
            if missing:
                violations.append("missing responses for: " + ", ".join(missing))
            if unknown:
                violations.append("responses contain unknown interrupt IDs: " + ", ".join(unknown))
            adapter_resume = responses
    else:
        violations.append("mode must be 'single' or 'by_id'")

    if not pending_ids:
        violations.append("no pending interrupts to resume")

    return {
        "ok": not violations,
        "violations": violations,
        "adapter_resume": adapter_resume if not violations else None,
        "pending_count": len(pending_ids),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pending", required=True, help="JSON file containing an array of pending interrupt objects with id")
    parser.add_argument("--resume", required=True, help="JSON file containing the canonical resume envelope")
    parser.add_argument("--json-out", help="optional report path")
    args = parser.parse_args()
    try:
        pending_ids = normalize_pending(load_json(args.pending))
        envelope = load_json(args.resume)
        report = validate(pending_ids, envelope)
    except ValueError as exc:
        print(f"input error: {exc}", file=sys.stderr)
        return EXIT_INPUT

    rendered = json.dumps(report, indent=2, ensure_ascii=False)
    print(rendered)
    if args.json_out:
        Path(args.json_out).write_text(rendered + "\n", encoding="utf-8")
    return EXIT_OK if report["ok"] else EXIT_POLICY


if __name__ == "__main__":
    raise SystemExit(main())
