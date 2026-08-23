#!/usr/bin/env python3
"""Validate a compacted context envelope against a source ledger.
Exit 0=allow, 2=invalid input, 3=reject.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
from typing import Any


def load(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def as_str_set(value: Any, field: str) -> set[str]:
    if not isinstance(value, list) or not all(isinstance(x, str) and x for x in value):
        raise ValueError(f"{field} must be a list of non-empty strings")
    return set(value)


def validate(source: dict[str, Any], candidate: dict[str, Any]) -> dict[str, Any]:
    for key in ("session_id", "source_message_ids", "critical_facts", "watermark"):
        if key not in source:
            raise ValueError(f"source missing {key}")
    for key in ("session_id", "source_message_ids", "preserved_facts", "watermark", "reference_only"):
        if key not in candidate:
            raise ValueError(f"candidate missing {key}")

    source_ids = as_str_set(source["source_message_ids"], "source_message_ids")
    cited_ids = as_str_set(candidate["source_message_ids"], "candidate.source_message_ids")
    required = as_str_set(source["critical_facts"], "critical_facts")
    preserved = as_str_set(candidate["preserved_facts"], "preserved_facts")

    violations: list[str] = []
    if candidate["session_id"] != source["session_id"]:
        violations.append("session_id_mismatch")
    unknown = sorted(cited_ids - source_ids)
    if unknown:
        violations.append("unknown_source_message_ids:" + ",".join(unknown))
    missing = sorted(required - preserved)
    if missing:
        violations.append("missing_critical_facts:" + ",".join(missing))
    if candidate["watermark"] != source["watermark"]:
        violations.append("watermark_mismatch")
    if candidate["reference_only"] is not True:
        violations.append("candidate_not_reference_only")

    source_status = source.get("task_status")
    candidate_status = candidate.get("task_status")
    if source_status == "completed" and candidate_status == "pending":
        violations.append("completed_task_reopened")

    source_language = source.get("language")
    if source_language and candidate.get("language") not in (None, source_language):
        violations.append("language_drift")

    decision = "allow" if not violations else "reject"
    return {
        "decision": decision,
        "violations": violations,
        "source_message_count": len(source_ids),
        "cited_message_count": len(cited_ids),
        "critical_fact_recall": 1.0 if not required else len(required & preserved) / len(required),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("candidate", type=Path)
    args = parser.parse_args()
    try:
        report = validate(load(args.source), load(args.candidate))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0 if report["decision"] == "allow" else 3


if __name__ == "__main__":
    raise SystemExit(main())
