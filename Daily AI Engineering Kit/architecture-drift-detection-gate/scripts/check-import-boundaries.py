#!/usr/bin/env python3
"""Detect deterministic architecture-boundary violations.

The checker is intentionally language-agnostic. It maps files to modules by path,
then uses configured regular-expression dependency markers and forbidden patterns.
For stronger precision, replace this scanner with a language-aware adapter while
keeping the same policy and workflow contract.

Exit codes:
  0  - no unapproved violations
  10 - one or more unapproved violations
  2  - operational/configuration error
"""

from __future__ import annotations

import argparse
import fnmatch
import json
import os
import re
import sys
from datetime import date
from pathlib import Path
from typing import Any, Iterable


def load_policy(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, dict):
        raise ValueError("policy must be a JSON object")
    return data


def normalize(path: Path | str) -> str:
    return str(path).replace("\\", "/").lstrip("./")


def matches_any(path: str, patterns: Iterable[str]) -> bool:
    return any(fnmatch.fnmatch(path, pattern) or path.startswith(pattern.rstrip("*") ) for pattern in patterns)


def module_for(path: str, modules: list[dict[str, Any]]) -> str | None:
    candidates: list[tuple[int, str]] = []
    for module in modules:
        name = module.get("name")
        for prefix in module.get("paths", []):
            normalized_prefix = normalize(prefix).rstrip("/") + "/"
            if path == normalized_prefix.rstrip("/") or path.startswith(normalized_prefix):
                candidates.append((len(normalized_prefix), name))
    if not candidates:
        return None
    candidates.sort(reverse=True)
    return candidates[0][1]


def exception_applies(rule_id: str, path: str, exceptions: list[dict[str, Any]]) -> tuple[bool, str | None]:
    today = date.today()
    for item in exceptions:
        if item.get("rule_id") != rule_id:
            continue
        try:
            expiry = date.fromisoformat(str(item.get("expires_on")))
        except ValueError:
            continue
        if expiry < today:
            continue
        paths = item.get("paths", [])
        if any(fnmatch.fnmatch(path, pattern) for pattern in paths):
            return True, item.get("id")
    return False, None


def iter_files(root: Path, policy: dict[str, Any], requested: list[str] | None) -> Iterable[Path]:
    ignored = policy.get("ignored_paths", [])
    if requested:
        for raw in requested:
            candidate = (root / raw).resolve() if not Path(raw).is_absolute() else Path(raw).resolve()
            if candidate.is_file():
                rel = normalize(candidate.relative_to(root.resolve())) if root.resolve() in candidate.parents or candidate == root.resolve() else normalize(candidate)
                if not matches_any(rel, ignored):
                    yield candidate
        return

    seen: set[Path] = set()
    for module in policy.get("modules", []):
        for prefix in module.get("paths", []):
            base = (root / prefix).resolve()
            if not base.exists():
                continue
            if base.is_file():
                candidates = [base]
            else:
                candidates = [p for p in base.rglob("*") if p.is_file()]
            for candidate in candidates:
                if candidate in seen:
                    continue
                seen.add(candidate)
                try:
                    rel = normalize(candidate.relative_to(root.resolve()))
                except ValueError:
                    continue
                if not matches_any(rel, ignored):
                    yield candidate


def scan_file(path: Path, rel: str, policy: dict[str, Any]) -> list[dict[str, Any]]:
    modules = policy.get("modules", [])
    source_module = module_for(rel, modules)
    if source_module is None:
        return []

    try:
        text = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return []

    allowed = set(policy.get("allowed_dependencies", {}).get(source_module, []))
    exceptions = policy.get("exceptions", [])
    violations: list[dict[str, Any]] = []

    # Cross-module dependency markers.
    for target in modules:
        target_name = target.get("name")
        if not target_name or target_name == source_module or target_name in allowed:
            continue
        for marker in target.get("dependency_markers", []):
            try:
                regex = re.compile(marker, re.MULTILINE)
            except re.error as exc:
                raise ValueError(f"invalid dependency marker regex for module '{target_name}': {marker}: {exc}") from exc
            match = regex.search(text)
            if not match:
                continue
            rule_id = f"dependency:{source_module}->{target_name}"
            approved, exception_id = exception_applies(rule_id, rel, exceptions)
            if approved:
                continue
            line = text.count("\n", 0, match.start()) + 1
            violations.append({
                "rule_id": rule_id,
                "type": "forbidden-dependency",
                "path": rel,
                "line": line,
                "source_module": source_module,
                "target_module": target_name,
                "marker": marker,
                "exception_id": exception_id,
            })
            break

    # Arbitrary forbidden patterns scoped to modules.
    for rule in policy.get("forbidden_patterns", []):
        scoped = rule.get("modules", [])
        if scoped and source_module not in scoped:
            continue
        rule_id = rule.get("id")
        pattern = rule.get("pattern")
        if not rule_id or not pattern:
            continue
        try:
            regex = re.compile(pattern, re.MULTILINE)
        except re.error as exc:
            raise ValueError(f"invalid forbidden pattern regex '{rule_id}': {exc}") from exc
        match = regex.search(text)
        if not match:
            continue
        approved, exception_id = exception_applies(rule_id, rel, exceptions)
        if approved:
            continue
        line = text.count("\n", 0, match.start()) + 1
        violations.append({
            "rule_id": rule_id,
            "type": "forbidden-pattern",
            "path": rel,
            "line": line,
            "source_module": source_module,
            "description": rule.get("description", ""),
            "pattern": pattern,
            "exception_id": exception_id,
        })

    return violations


def main() -> int:
    parser = argparse.ArgumentParser(description="Check deterministic architecture boundaries")
    parser.add_argument("--policy", default=None, help="Policy JSON; defaults to ARCHITECTURE_POLICY or .architecture-policy.json")
    parser.add_argument("--root", default=".", help="Repository root")
    parser.add_argument("--files", nargs="*", help="Optional explicit files to scan relative to root")
    parser.add_argument("--output", help="Optional path for JSON report")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    policy_path = Path(args.policy or os.getenv("ARCHITECTURE_POLICY", ".architecture-policy.json"))
    if not policy_path.is_absolute():
        policy_path = (root / policy_path).resolve()

    try:
        policy = load_policy(policy_path)
        files = list(iter_files(root, policy, args.files))
        violations: list[dict[str, Any]] = []
        scanned: list[str] = []
        for file_path in files:
            try:
                rel = normalize(file_path.relative_to(root))
            except ValueError:
                continue
            scanned.append(rel)
            violations.extend(scan_file(file_path, rel, policy))
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        result = {"status": "error", "error": str(exc), "violations": []}
        print(json.dumps(result, indent=2))
        return 2

    result = {
        "status": "pass" if not violations else "violation",
        "policy": normalize(policy_path),
        "root": normalize(root),
        "scanned_file_count": len(scanned),
        "violation_count": len(violations),
        "violations": violations,
    }

    rendered = json.dumps(result, indent=2)
    print(rendered)
    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(rendered + "\n", encoding="utf-8")

    return 0 if not violations else 10


if __name__ == "__main__":
    sys.exit(main())
