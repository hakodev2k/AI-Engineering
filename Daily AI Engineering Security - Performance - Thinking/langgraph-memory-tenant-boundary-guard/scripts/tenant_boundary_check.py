#!/usr/bin/env python3
"""Deterministically detect cross-tenant memory returns and unsafe query filters."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Iterable


def load_records(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        raise FileNotFoundError(f"input file not found: {path}")
    text = path.read_text(encoding="utf-8").strip()
    if not text:
        return []
    if text.startswith("["):
        value = json.loads(text)
        if not isinstance(value, list):
            raise ValueError("JSON input must be a list of objects")
        records = value
    else:
        records = [json.loads(line) for line in text.splitlines() if line.strip()]
    if not all(isinstance(item, dict) for item in records):
        raise ValueError("every record must be a JSON object")
    return records


def operator_paths(value: Any, prefix: str = "$") -> list[str]:
    found: list[str] = []
    if isinstance(value, dict):
        for key, child in value.items():
            path = f"{prefix}.{key}"
            if isinstance(key, str) and key.startswith("$"):
                found.append(path)
            found.extend(operator_paths(child, path))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            found.extend(operator_paths(child, f"{prefix}[{index}]"))
    return found


def analyze(records: Iterable[dict[str, Any]]) -> dict[str, Any]:
    violations: list[dict[str, Any]] = []
    total = 0
    for index, record in enumerate(records, start=1):
        total += 1
        request_tenant = record.get("request_tenant")
        object_tenant = record.get("object_tenant")
        if not isinstance(request_tenant, str) or not request_tenant:
            violations.append({"row": index, "type": "missing_request_tenant"})
        if not isinstance(object_tenant, str) or not object_tenant:
            violations.append({"row": index, "type": "missing_object_tenant"})
        if isinstance(request_tenant, str) and isinstance(object_tenant, str) and request_tenant != object_tenant:
            violations.append({
                "row": index,
                "type": "cross_tenant_object",
                "request_tenant": request_tenant,
                "object_tenant": object_tenant,
                "operation": record.get("operation"),
                "source": record.get("source"),
            })
        paths = operator_paths(record.get("filter"))
        if paths:
            violations.append({"row": index, "type": "unsafe_query_operator", "paths": paths})

    by_type: dict[str, int] = {}
    for item in violations:
        by_type[item["type"]] = by_type.get(item["type"], 0) + 1
    return {
        "ok": not violations,
        "records": total,
        "violation_count": len(violations),
        "violations_by_type": by_type,
        "violations": violations,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="JSON or JSONL boundary-test results")
    parser.add_argument("--json-out", type=Path, help="optional report path")
    args = parser.parse_args()
    try:
        report = analyze(load_records(args.input))
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    rendered = json.dumps(report, indent=2, sort_keys=True)
    print(rendered)
    if args.json_out:
        try:
            args.json_out.write_text(rendered + "\n", encoding="utf-8")
        except OSError as exc:
            print(f"error writing report: {exc}", file=sys.stderr)
            return 2
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
