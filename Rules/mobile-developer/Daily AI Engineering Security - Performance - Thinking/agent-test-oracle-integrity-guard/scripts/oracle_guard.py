#!/usr/bin/env python3
"""Audit AI-agent diffs for test-oracle integrity.

Exit codes:
  0 = pass
  2 = policy violation / review required
  3 = invalid input/config
  4 = I/O error

The script never edits repository files. It consumes a unified diff plus policy JSON.
"""
from __future__ import annotations

import argparse
import fnmatch
import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Any


def load_json(path: str) -> dict[str, Any]:
    try:
        value = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"cannot read policy: {exc}") from exc
    if not isinstance(value, dict):
        raise RuntimeError("policy root must be an object")
    return value


def match_protected(path: str, globs: list[str]) -> bool:
    normalized = path.replace("\\", "/")
    return any(fnmatch.fnmatch(normalized, g) or fnmatch.fnmatch(normalized.lower(), g.lower()) for g in globs)


def parse_diff(text: str) -> list[dict[str, Any]]:
    files: list[dict[str, Any]] = []
    current: dict[str, Any] | None = None
    for line in text.splitlines():
        if line.startswith("diff --git "):
            if current:
                files.append(current)
            parts = line.split()
            b = parts[3][2:] if len(parts) >= 4 and parts[3].startswith("b/") else ""
            current = {"path": b, "added": [], "removed": [], "deleted": False}
        elif current is not None:
            if line.startswith("deleted file mode"):
                current["deleted"] = True
            elif line.startswith("+++") or line.startswith("---"):
                continue
            elif line.startswith("+"):
                current["added"].append(line[1:])
            elif line.startswith("-"):
                current["removed"].append(line[1:])
    if current:
        files.append(current)
    return files


def audit(files: list[dict[str, Any]], policy: dict[str, Any], approved_paths: set[str]) -> dict[str, Any]:
    globs = [str(x) for x in policy.get("protected_globs", [])]
    patterns = [str(x) for x in policy.get("weakening_patterns", [])]
    findings: list[dict[str, Any]] = []
    protected_changed: list[str] = []

    for f in files:
        path = str(f.get("path", ""))
        if not path:
            continue
        protected = match_protected(path, globs)
        if protected:
            protected_changed.append(path)
            if policy.get("approval_required_for_protected_changes", True) and path not in approved_paths:
                findings.append({"code": "UNAPPROVED_ORACLE_CHANGE", "path": path})
            if f.get("deleted") and policy.get("fail_on_deleted_tests", True):
                findings.append({"code": "PROTECTED_FILE_DELETED", "path": path})

        for added in f.get("added", []):
            lower = added.lower()
            for pattern in patterns:
                if pattern.lower() in lower:
                    findings.append({"code": "WEAKENING_PATTERN_ADDED", "path": path, "pattern": pattern, "line": added[:240]})

        # Conservative semantic heuristics. They create review findings, not automatic accusations.
        removed_assertions = sum(1 for x in f.get("removed", []) if re.search(r"\b(assert|expect\(|should\.|Assert\.)", x))
        added_assertions = sum(1 for x in f.get("added", []) if re.search(r"\b(assert|expect\(|should\.|Assert\.)", x))
        if protected and removed_assertions > added_assertions:
            findings.append({"code": "ASSERTION_COUNT_DECREASED", "path": path, "removed": removed_assertions, "added": added_assertions})

        removed_tests = sum(1 for x in f.get("removed", []) if re.search(r"\b(def test_|\[Fact|\[Theory|\bit\(|\btest\(|\bdescribe\()", x))
        added_tests = sum(1 for x in f.get("added", []) if re.search(r"\b(def test_|\[Fact|\[Theory|\bit\(|\btest\(|\bdescribe\()", x))
        if protected and removed_tests > added_tests:
            findings.append({"code": "TEST_DECLARATION_COUNT_DECREASED", "path": path, "removed": removed_tests, "added": added_tests})

    return {
        "protected_changed": sorted(set(protected_changed)),
        "findings": findings,
        "finding_count": len(findings),
        "protected_change_count": len(set(protected_changed)),
    }


def manifest_hash(paths: list[str]) -> str:
    payload = "\n".join(sorted(paths)).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--diff", required=True, help="Path to unified git diff")
    parser.add_argument("--policy", required=True)
    parser.add_argument("--approved-path", action="append", default=[])
    parser.add_argument("--report")
    args = parser.parse_args()
    try:
        text = Path(args.diff).read_text(encoding="utf-8")
        policy = load_json(args.policy)
        files = parse_diff(text)
        result = audit(files, policy, set(args.approved_path))
        result["changed_file_count"] = len(files)
        result["protected_manifest_sha256"] = manifest_hash(result["protected_changed"])
        out = json.dumps(result, indent=2, ensure_ascii=False)
        if args.report:
            Path(args.report).write_text(out + "\n", encoding="utf-8")
        print(out)
        return 2 if result["finding_count"] else 0
    except RuntimeError as exc:
        print(str(exc), file=sys.stderr)
        return 3
    except OSError as exc:
        print(f"I/O error: {exc}", file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
