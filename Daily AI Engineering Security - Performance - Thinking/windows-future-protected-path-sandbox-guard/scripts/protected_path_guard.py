#!/usr/bin/env python3
"""Existence-independent protected-path preflight guard.
Exit codes: 0 allow, 2 invalid input/config, 4 denied.
"""
from __future__ import annotations
import argparse, json, os, sys
from pathlib import Path

ALLOW, INVALID, DENY = 0, 2, 4
MUTATIONS = {"create", "write", "patch", "delete", "rename", "move", "link"}


def load_policy(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read policy: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("policy must be an object")
    protected = data.get("protected_paths")
    if not isinstance(protected, list) or not protected or not all(isinstance(x, str) and x.strip() for x in protected):
        raise ValueError("protected_paths must be a non-empty string array")
    return data


def norm_relative(value: str) -> str:
    value = value.replace("\\", "/").strip()
    while value.startswith("./"):
        value = value[2:]
    parts = []
    for part in value.split("/"):
        if part in ("", "."):
            continue
        if part == "..":
            raise ValueError("protected path cannot contain ..")
        parts.append(part.casefold())
    if not parts:
        raise ValueError("protected path cannot be empty")
    return "/".join(parts)


def target_relative(workspace: Path, target: str) -> tuple[str, str]:
    base = workspace.expanduser().resolve(strict=True)
    raw = Path(target).expanduser()
    candidate = raw if raw.is_absolute() else base / raw
    # Do not require target existence. Resolve existing ancestors lexically/safely.
    candidate = Path(os.path.abspath(os.path.normpath(str(candidate))))
    try:
        rel = candidate.relative_to(base)
    except ValueError as exc:
        raise ValueError("target escapes workspace") from exc
    rel_norm = "/".join(p.casefold() for p in rel.parts)
    if not rel_norm:
        raise ValueError("workspace root mutation is not accepted by this guard")
    return str(candidate), rel_norm


def decide(policy: dict, workspace: Path, target: str, operation: str) -> dict:
    if operation not in MUTATIONS:
        raise ValueError(f"unsupported operation: {operation}")
    canonical, rel = target_relative(workspace, target)
    rules = [norm_relative(x) for x in policy["protected_paths"]]
    for rule in rules:
        if rel == rule or rel.startswith(rule + "/"):
            return {"decision": "deny", "operation": operation, "canonical_target": canonical,
                    "workspace_relative": rel, "matched_rule": rule, "reason": "protected_path"}
    return {"decision": "allow", "operation": operation, "canonical_target": canonical,
            "workspace_relative": rel, "matched_rule": None, "reason": "no_protected_prefix_match"}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--policy", type=Path, required=True)
    ap.add_argument("--workspace", type=Path, required=True)
    ap.add_argument("--target", required=True)
    ap.add_argument("--operation", choices=sorted(MUTATIONS), required=True)
    args = ap.parse_args()
    try:
        result = decide(load_policy(args.policy), args.workspace, args.target, args.operation)
    except (ValueError, OSError) as exc:
        print(json.dumps({"decision": "invalid", "reason": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return DENY if result["decision"] == "deny" else ALLOW


if __name__ == "__main__":
    raise SystemExit(main())
