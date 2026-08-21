#!/usr/bin/env python3
"""Verify a lossless-agent-context checkpoint and optional resume state.

Exit codes:
0 verified
2 invalid input/policy
3 checkpoint/resume verification failed
4 artifact I/O error
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
from pathlib import Path
from typing import Any


def read_json(path: str) -> dict[str, Any]:
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"JSON root must be object: {path}")
    return data


def sha256_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def nonempty_text(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def verify_checkpoint(cp: dict[str, Any], policy: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    required = policy.get("requiredFields", [])
    for key in required:
        if key not in cp:
            errors.append(f"missing required field: {key}")
        elif cp[key] is None:
            errors.append(f"required field is null: {key}")

    if not nonempty_text(cp.get("task_id")):
        errors.append("task_id must be non-empty text")
    if not nonempty_text(cp.get("checkpoint_id")):
        errors.append("checkpoint_id must be non-empty text")
    if not nonempty_text(cp.get("active_model")):
        errors.append("active_model must be non-empty text")
    if not nonempty_text(cp.get("goal")):
        errors.append("goal must be non-empty text")
    if cp.get("verification_status") not in {"unverified", "partial", "verified"}:
        errors.append("invalid verification_status")

    array_fields = [
        "constraints", "facts", "assumptions_to_verify", "decisions", "changed_files",
        "tests_and_commands", "artifacts", "blockers", "next_actions"
    ]
    for key in array_fields:
        if key in cp and not isinstance(cp[key], list):
            errors.append(f"{key} must be an array")

    if isinstance(cp.get("next_actions"), list) and not cp["next_actions"]:
        errors.append("next_actions cannot be empty")

    max_tokens = int(policy.get("thresholds", {}).get("maxCheckpointApproxTokens", 8000))
    approx = cp.get("approx_tokens")
    if isinstance(approx, int) and approx > max_tokens:
        errors.append(f"approx_tokens {approx} exceeds max {max_tokens}")

    artifact_policy = policy.get("artifactPolicy", {})
    require_hash = bool(artifact_policy.get("requireHashForExternalArtifact", True))
    for i, art in enumerate(cp.get("artifacts", []) if isinstance(cp.get("artifacts"), list) else []):
        if not isinstance(art, dict):
            errors.append(f"artifact[{i}] must be object")
            continue
        path = art.get("path")
        uri = art.get("uri")
        digest = art.get("sha256")
        if not path and not uri:
            errors.append(f"artifact[{i}] requires path or uri")
            continue
        if require_hash and not digest:
            errors.append(f"artifact[{i}] missing sha256")
        if path:
            p = Path(path)
            if not p.is_file():
                errors.append(f"artifact[{i}] file missing: {path}")
            elif digest:
                try:
                    actual = sha256_file(path)
                except OSError as exc:
                    errors.append(f"artifact[{i}] read failed: {exc}")
                else:
                    if actual.lower() != str(digest).lower():
                        errors.append(f"artifact[{i}] sha256 mismatch")

    if cp.get("verification_status") == "verified":
        tests = cp.get("tests_and_commands", [])
        if not tests:
            errors.append("verified checkpoint requires test/command evidence")
        else:
            has_success = False
            for item in tests:
                if isinstance(item, dict) and item.get("status") in {"passed", "success", "ok"}:
                    has_success = True
            if not has_success:
                errors.append("verified checkpoint lacks explicit successful verification evidence")

    return errors


def normalize_set(value: Any) -> set[str]:
    if not isinstance(value, list):
        return set()
    out: set[str] = set()
    for item in value:
        if isinstance(item, str):
            out.add(item.strip())
        elif isinstance(item, dict):
            identifier = item.get("path") or item.get("name") or item.get("id") or item.get("action")
            if identifier:
                out.add(str(identifier).strip())
    return {x for x in out if x}


def verify_resume(cp: dict[str, Any], resume: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    if resume.get("task_id") and resume.get("task_id") != cp.get("task_id"):
        errors.append("resume task_id does not match checkpoint")
    if resume.get("goal") and str(resume.get("goal")).strip() != str(cp.get("goal")).strip():
        errors.append("resume goal differs from checkpoint goal")

    cp_constraints = normalize_set(cp.get("constraints"))
    resume_constraints = normalize_set(resume.get("constraints"))
    if resume_constraints and not cp_constraints.issubset(resume_constraints):
        errors.append("resume state dropped one or more checkpoint constraints")

    cp_changed = normalize_set(cp.get("changed_files"))
    resume_changed = normalize_set(resume.get("changed_files"))
    if resume_changed and not cp_changed.issubset(resume_changed):
        errors.append("resume state dropped one or more changed files")

    cp_blockers = normalize_set(cp.get("blockers"))
    resume_blockers = normalize_set(resume.get("blockers"))
    if resume_blockers and not cp_blockers.issubset(resume_blockers):
        errors.append("resume state dropped one or more unresolved blockers")

    return errors


def main() -> int:
    p = argparse.ArgumentParser(description="Verify lossless context checkpoint")
    p.add_argument("checkpoint")
    p.add_argument("--policy", required=True)
    p.add_argument("--resume-state")
    args = p.parse_args()

    try:
        cp = read_json(args.checkpoint)
        policy = read_json(args.policy)
        errors = verify_checkpoint(cp, policy)
        if args.resume_state:
            resume = read_json(args.resume_state)
            errors.extend(verify_resume(cp, resume))
    except ValueError as exc:
        print(json.dumps({"verified": False, "errors": [str(exc)]}, indent=2), file=sys.stderr)
        return 2

    result = {"verified": not errors, "errors": errors}
    stream = sys.stdout if not errors else sys.stderr
    print(json.dumps(result, ensure_ascii=False, indent=2), file=stream)
    return 0 if not errors else 3


if __name__ == "__main__":
    raise SystemExit(main())
