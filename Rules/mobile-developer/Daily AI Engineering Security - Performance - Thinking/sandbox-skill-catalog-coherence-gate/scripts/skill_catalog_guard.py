#!/usr/bin/env python3
"""Validate a run-scoped sandbox skill catalog snapshot.

Snapshot JSON:
{
  "generation_id": "gen-42",
  "catalog_hash": "sha256:...",
  "expected_skills": ["a", "b"],
  "advertised_skills": [
    {"id":"a", "path":"/workspace/skills/a/SKILL.md", "readable":true},
    {"id":"b", "path":"/workspace/skills/b/SKILL.md", "readable":true}
  ],
  "rebuild_attempts": 0
}

Exit codes: 0 allow, 2 invalid input, 3 rebuild, 4 block.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

ALLOW, INVALID, REBUILD, BLOCK = 0, 2, 3, 4


def load_object(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def string_list(value: object, name: str) -> list[str]:
    if not isinstance(value, list) or not all(isinstance(x, str) and x for x in value):
        raise ValueError(f"{name} must be an array of non-empty strings")
    if len(value) != len(set(value)):
        raise ValueError(f"{name} contains duplicates")
    return value


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("snapshot", type=Path)
    parser.add_argument("--policy", required=True, type=Path)
    args = parser.parse_args()

    try:
        snap = load_object(args.snapshot)
        policy = load_object(args.policy)
        generation = snap.get("generation_id")
        supplied_hash = snap.get("catalog_hash")
        attempts = snap.get("rebuild_attempts", 0)
        if policy.get("require_generation_id", True) and (not isinstance(generation, str) or not generation):
            raise ValueError("generation_id is required")
        if policy.get("require_catalog_hash", True) and (not isinstance(supplied_hash, str) or not supplied_hash):
            raise ValueError("catalog_hash is required")
        if not isinstance(attempts, int) or isinstance(attempts, bool) or attempts < 0:
            raise ValueError("rebuild_attempts must be a non-negative integer")

        expected = string_list(snap.get("expected_skills", []), "expected_skills")
        advertised_raw = snap.get("advertised_skills", [])
        if not isinstance(advertised_raw, list):
            raise ValueError("advertised_skills must be an array")

        advertised: dict[str, dict] = {}
        unreadable: list[str] = []
        for i, item in enumerate(advertised_raw):
            if not isinstance(item, dict):
                raise ValueError(f"advertised_skills[{i}] must be object")
            sid, path, readable = item.get("id"), item.get("path"), item.get("readable")
            if not isinstance(sid, str) or not sid:
                raise ValueError(f"advertised_skills[{i}].id must be non-empty string")
            if sid in advertised:
                raise ValueError(f"duplicate advertised skill: {sid}")
            if not isinstance(path, str) or not path:
                raise ValueError(f"advertised_skills[{i}].path must be non-empty string")
            if not isinstance(readable, bool):
                raise ValueError(f"advertised_skills[{i}].readable must be boolean")
            advertised[sid] = item
            if not readable:
                unreadable.append(sid)

        expected_set, advertised_set = set(expected), set(advertised)
        missing = sorted(expected_set - advertised_set)
        extra = sorted(advertised_set - expected_set)
        canonical = [{"id": sid, "path": advertised[sid]["path"]} for sid in sorted(advertised)]
        computed_hash = "sha256:" + hashlib.sha256(
            json.dumps(canonical, separators=(",", ":"), sort_keys=True).encode("utf-8")
        ).hexdigest()
        hash_mismatch = isinstance(supplied_hash, str) and supplied_hash != computed_hash

        expected_count = len(expected)
        completeness = 1.0 if expected_count == 0 else (expected_count - len(missing)) / expected_count
        readability = 1.0 if not advertised else (len(advertised) - len(unreadable)) / len(advertised)

        findings: list[str] = []
        if missing: findings.append("expected eligible skills missing from catalog")
        if unreadable: findings.append("advertised skills are not sandbox-readable")
        if hash_mismatch: findings.append("catalog hash does not match normalized advertised catalog")
        if extra: findings.append("catalog contains unexpected skill entries")

        max_missing = int(policy.get("max_missing_skills", 0))
        max_unreadable = int(policy.get("max_unreadable_skills", 0))
        violates = len(missing) > max_missing or len(unreadable) > max_unreadable or hash_mismatch
        max_attempts = int(policy.get("max_rebuild_attempts", 1))

        if violates and attempts < max_attempts:
            decision, code = "rebuild", REBUILD
        elif violates:
            decision, code = "block", BLOCK
        else:
            decision, code = "allow", ALLOW

        print(json.dumps({
            "decision": decision,
            "generation_id": generation,
            "computed_catalog_hash": computed_hash,
            "supplied_catalog_hash": supplied_hash,
            "missing_skills": missing,
            "extra_skills": extra,
            "unreadable_skills": sorted(unreadable),
            "completeness_ratio": round(completeness, 6),
            "readability_ratio": round(readability, 6),
            "rebuild_attempts": attempts,
            "findings": findings,
        }, indent=2, sort_keys=True))
        return code
    except (ValueError, TypeError, OverflowError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID


if __name__ == "__main__":
    raise SystemExit(main())
