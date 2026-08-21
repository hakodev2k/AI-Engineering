#!/usr/bin/env python3
"""Build context checkpoints, calculate context budgets, and create artifact metadata.

Standard library only. Exit codes:
0 success
2 invalid user input / policy
3 checkpoint validation failure
4 filesystem/artifact error
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def load_json(path: str) -> dict[str, Any]:
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"JSON root must be an object: {path}")
    return data


def save_json(path: str, data: dict[str, Any]) -> None:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    temp = p.with_suffix(p.suffix + ".tmp")
    with open(temp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write("\n")
    os.replace(temp, p)


def approx_tokens(value: Any) -> int:
    text = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    return max(1, (len(text) + 3) // 4)


def sha256_file(path: str) -> str:
    h = hashlib.sha256()
    try:
        with open(path, "rb") as f:
            for chunk in iter(lambda: f.read(1024 * 1024), b""):
                h.update(chunk)
    except OSError as exc:
        raise IOError(f"cannot hash artifact {path}: {exc}") from exc
    return h.hexdigest()


def budget_command(args: argparse.Namespace) -> int:
    policy = load_json(args.policy)
    thresholds = policy.get("thresholds", {})
    if args.limit <= 0 or args.used < 0 or args.used > args.limit * 2:
        print(json.dumps({"error": "invalid token counts"}), file=sys.stderr)
        return 2

    soft = float(thresholds.get("softContextRatio", 0.70))
    checkpoint = float(thresholds.get("checkpointContextRatio", 0.78))
    hard = float(thresholds.get("hardStopContextRatio", 0.88))
    reserve = int(thresholds.get("minimumRecoveryReserveTokens", 24000))
    if not (0 < soft < checkpoint < hard < 1):
        print(json.dumps({"error": "thresholds must satisfy 0 < soft < checkpoint < hard < 1"}), file=sys.stderr)
        return 2

    ratio = args.used / args.limit
    remaining = max(0, args.limit - args.used)
    if ratio >= hard or remaining < reserve:
        action = "hard-stop"
    elif ratio >= checkpoint:
        action = "checkpoint-now"
    elif ratio >= soft:
        action = "prepare-checkpoint"
    else:
        action = "continue"

    out = {
        "active_model": args.model,
        "context_limit_tokens": args.limit,
        "used_tokens": args.used,
        "remaining_tokens": remaining,
        "usage_ratio": round(ratio, 6),
        "recovery_reserve_tokens": reserve,
        "action": action,
        "measured_at": datetime.now(timezone.utc).isoformat(),
    }
    print(json.dumps(out, ensure_ascii=False, indent=2))
    return 0


def artifact_command(args: argparse.Namespace) -> int:
    p = Path(args.path)
    if not p.is_file():
        print(json.dumps({"error": f"artifact not found: {args.path}"}), file=sys.stderr)
        return 4
    try:
        stat = p.stat()
        digest = sha256_file(str(p))
    except OSError as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 4

    record = {
        "purpose": args.purpose,
        "path": str(p),
        "media_type": args.media_type,
        "size_bytes": stat.st_size,
        "sha256": digest,
        "producer": args.producer,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    print(json.dumps(record, ensure_ascii=False, indent=2))
    return 0


def normalize_list(state: dict[str, Any], key: str) -> list[Any]:
    value = state.get(key, [])
    if value is None:
        return []
    if not isinstance(value, list):
        raise ValueError(f"{key} must be an array")
    return value


def build_command(args: argparse.Namespace) -> int:
    policy = load_json(args.policy)
    state = load_json(args.input)
    required = list(policy.get("requiredFields", []))

    checkpoint = {
        "schema_version": int(policy.get("version", 1)),
        "task_id": state.get("task_id"),
        "checkpoint_id": state.get("checkpoint_id"),
        "created_at": state.get("created_at") or datetime.now(timezone.utc).isoformat(),
        "active_model": state.get("active_model"),
        "goal": state.get("goal"),
        "constraints": normalize_list(state, "constraints"),
        "facts": normalize_list(state, "facts"),
        "assumptions_to_verify": normalize_list(state, "assumptions_to_verify"),
        "decisions": normalize_list(state, "decisions"),
        "changed_files": normalize_list(state, "changed_files"),
        "tests_and_commands": normalize_list(state, "tests_and_commands"),
        "artifacts": normalize_list(state, "artifacts"),
        "blockers": normalize_list(state, "blockers"),
        "next_actions": normalize_list(state, "next_actions"),
        "verification_status": state.get("verification_status", "unverified"),
        "failed_approaches": normalize_list(state, "failed_approaches"),
        "source_checkpoint_id": state.get("source_checkpoint_id"),
    }

    errors: list[str] = []
    for key in required:
        if key not in checkpoint:
            errors.append(f"missing required field: {key}")
        elif checkpoint[key] is None:
            errors.append(f"required field is null: {key}")

    if not isinstance(checkpoint.get("goal"), str) or not checkpoint["goal"].strip():
        errors.append("goal must be a non-empty string")
    if checkpoint["verification_status"] not in {"unverified", "partial", "verified"}:
        errors.append("verification_status must be unverified, partial, or verified")
    if not checkpoint["next_actions"]:
        errors.append("next_actions must contain at least one executable next action")

    estimated = approx_tokens(checkpoint)
    checkpoint["approx_tokens"] = estimated
    max_tokens = int(policy.get("thresholds", {}).get("maxCheckpointApproxTokens", 8000))
    if estimated > max_tokens:
        errors.append(f"checkpoint approx_tokens {estimated} exceeds max {max_tokens}")

    if errors:
        print(json.dumps({"valid": False, "errors": errors}, ensure_ascii=False, indent=2), file=sys.stderr)
        return 3

    save_json(args.output, checkpoint)
    print(json.dumps({"valid": True, "output": args.output, "approx_tokens": estimated}, indent=2))
    return 0


def parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Lossless agent context checkpoint utility")
    sub = p.add_subparsers(dest="command", required=True)

    b = sub.add_parser("budget", help="calculate context-budget action")
    b.add_argument("--limit", type=int, required=True)
    b.add_argument("--used", type=int, required=True)
    b.add_argument("--model", default="unknown")
    b.add_argument("--policy", required=True)
    b.set_defaults(func=budget_command)

    a = sub.add_parser("artifact", help="create SHA-256 artifact metadata")
    a.add_argument("--path", required=True)
    a.add_argument("--purpose", required=True)
    a.add_argument("--producer", default="unknown")
    a.add_argument("--media-type", default="application/octet-stream")
    a.set_defaults(func=artifact_command)

    c = sub.add_parser("build", help="build and validate a checkpoint candidate")
    c.add_argument("--input", required=True)
    c.add_argument("--output", required=True)
    c.add_argument("--policy", required=True)
    c.set_defaults(func=build_command)

    return p


def main() -> int:
    try:
        args = parser().parse_args()
        return int(args.func(args))
    except ValueError as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 2
    except IOError as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
