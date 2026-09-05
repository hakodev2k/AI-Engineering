#!/usr/bin/env python3
"""Validate durable active-goal state without inspecting model reasoning."""
import json
import sys
from pathlib import Path

REQUIRED = {"version", "goal_id", "goal", "status", "completion_criteria", "pending_work", "evidence", "resume_mode"}
STATUSES = {"in_progress", "completed", "blocked"}
MODES = {"autonomous", "interactive"}
SECRET_KEYS = {"password", "secret", "api_key", "token", "access_token", "refresh_token"}


def load(path):
    try:
        value = json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON: {exc}")
    if not isinstance(value, dict):
        raise ValueError("checkpoint must be a JSON object")
    return value


def secret_paths(value, path="$"):
    hits = []
    if isinstance(value, dict):
        for k, v in value.items():
            key = str(k).lower()
            p = f"{path}.{k}"
            if key in SECRET_KEYS and v not in (None, "", "REDACTED"):
                hits.append(p)
            hits.extend(secret_paths(v, p))
    elif isinstance(value, list):
        for i, v in enumerate(value):
            hits.extend(secret_paths(v, f"{path}[{i}]"))
    return hits


def validate(c):
    errors = []
    missing = sorted(REQUIRED - c.keys())
    if missing:
        errors.append("missing fields: " + ", ".join(missing))
    if c.get("status") not in STATUSES:
        errors.append("status must be in_progress, completed, or blocked")
    if c.get("resume_mode") not in MODES:
        errors.append("resume_mode must be autonomous or interactive")
    for key in ("goal_id", "goal"):
        if not isinstance(c.get(key), str) or not c.get(key, "").strip():
            errors.append(f"{key} must be a non-empty string")
    criteria = c.get("completion_criteria")
    pending = c.get("pending_work")
    evidence = c.get("evidence")
    if not isinstance(criteria, list) or not criteria:
        errors.append("completion_criteria must be a non-empty list")
    if not isinstance(pending, list):
        errors.append("pending_work must be a list")
    if not isinstance(evidence, list):
        errors.append("evidence must be a list")
    if c.get("status") == "in_progress" and isinstance(pending, list) and not pending:
        errors.append("in_progress checkpoint must contain pending_work")
    if c.get("status") == "completed" and isinstance(pending, list) and pending:
        errors.append("completed checkpoint must not contain pending_work")
    hits = secret_paths(c)
    if hits:
        errors.append("possible secret-bearing fields: " + ", ".join(hits))
    return errors


def main(argv):
    if len(argv) != 2:
        print(f"usage: {argv[0]} <checkpoint.json>", file=sys.stderr)
        return 1
    try:
        checkpoint = load(argv[1])
    except (OSError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    errors = validate(checkpoint)
    if errors:
        print("BLOCK")
        for error in errors:
            print(f"- {error}")
        return 2
    print(f"PASS: checkpoint {checkpoint['goal_id']} is structurally resumable")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
