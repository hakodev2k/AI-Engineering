#!/usr/bin/env python3
"""Validate a pre-change decision record and gate source writes.

Exit codes:
  0 change-required and evidence is sufficient for implementation
  2 invalid input/schema
  3 insufficient evidence
  4 no-change (successful triage outcome; writes blocked)
  5 contradictory or unverified evidence
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ALLOWED = {"change-required", "no-change", "insufficient-evidence"}
REQUIRED_KEYS = {
    "decision",
    "facts",
    "assumptions",
    "evidence",
    "hypotheses",
    "risks",
    "verification_status",
}


def fail(message: str, code: int) -> int:
    print(message, file=sys.stderr)
    return code


def load(path: Path) -> dict:
    if not path.is_file():
        raise ValueError(f"decision record not found: {path}")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read valid JSON: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("decision record must be a JSON object")
    return data


def nonempty_list(data: dict, key: str) -> bool:
    value = data.get(key)
    return isinstance(value, list) and any(str(item).strip() for item in value)


def validate(data: dict) -> tuple[int, str]:
    missing = sorted(REQUIRED_KEYS - set(data))
    if missing:
        return 2, f"missing keys: {', '.join(missing)}"

    decision = data.get("decision")
    if decision not in ALLOWED:
        return 2, f"invalid decision: {decision!r}"

    for key in ("facts", "evidence", "hypotheses", "risks"):
        if not isinstance(data.get(key), list):
            return 2, f"{key} must be a list"
    if not isinstance(data.get("assumptions"), list):
        return 2, "assumptions must be a list"

    if decision == "insufficient-evidence":
        return 3, "insufficient-evidence: source writes blocked"

    if not nonempty_list(data, "facts"):
        return 3, "at least one observed fact is required"
    evidence = [e for e in data["evidence"] if str(e).strip()]
    if len(evidence) < 2:
        return 3, "at least two evidence items are required"

    status = str(data.get("verification_status", "")).strip().lower()
    if status not in {"verified", "reviewed"}:
        return 5, "verification_status must be 'verified' or 'reviewed'"

    contradictions = data.get("contradictions", [])
    if contradictions:
        return 5, "unresolved contradictions are present"

    partial_fix_checked = data.get("partial_fix_checked")
    if partial_fix_checked is not True:
        return 3, "partial_fix_checked must be true"

    if decision == "no-change":
        return 4, "no-change: triage complete; source writes blocked"

    return 0, "change-required: evidence gate passed"


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        return fail(f"usage: {Path(argv[0]).name} <decision.json>", 2)
    try:
        data = load(Path(argv[1]))
    except ValueError as exc:
        return fail(str(exc), 2)
    code, message = validate(data)
    stream = sys.stdout if code in {0, 4} else sys.stderr
    print(message, file=stream)
    return code


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
