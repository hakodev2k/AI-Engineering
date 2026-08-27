#!/usr/bin/env python3
"""Deterministic policy gate for AI-agent file writes."""
from __future__ import annotations
import argparse, fnmatch, json
from pathlib import Path


def _norm(path: Path) -> str:
    return path.as_posix()


def _match(path: str, patterns: list[str]) -> str | None:
    p = path.lstrip("./")
    for pattern in patterns:
        normalized = pattern.replace("\\", "/").lstrip("./")
        if fnmatch.fnmatch(p, normalized) or fnmatch.fnmatch("/" + p, normalized):
            return pattern
    return None


def evaluate(request: dict, policy: dict) -> dict:
    required = ["path", "workspace_root"]
    missing = [k for k in required if not request.get(k)]
    if missing:
        return {"decision": "block", "reasons": [f"missing:{k}" for k in missing]}

    workspace = Path(request["workspace_root"]).expanduser().resolve(strict=False)
    target_raw = Path(request["path"]).expanduser()
    target = (workspace / target_raw).resolve(strict=False) if not target_raw.is_absolute() else target_raw.resolve(strict=False)
    home = Path.home().resolve(strict=False)
    reasons: list[str] = []
    target_s = _norm(target)

    try:
        rel_workspace = _norm(target.relative_to(workspace))
        in_workspace = True
    except ValueError:
        rel_workspace = target_s
        in_workspace = False

    if not in_workspace and not policy.get("allow_outside_workspace", False):
        reasons.append("outside_workspace")

    if policy.get("resolve_symlinks", True):
        raw_parent = (workspace / target_raw.parent) if not target_raw.is_absolute() else target_raw.parent
        if raw_parent.exists() and raw_parent.resolve() != raw_parent.absolute():
            reasons.append("symlinked_parent")

    blocked = _match(target_s, policy.get("always_block_patterns", []))
    if blocked:
        return {"decision": "block", "canonical_path": target_s, "reasons": [f"always_block:{blocked}"] + reasons}

    sensitive_match = _match(rel_workspace, policy.get("workspace_relative_patterns", [])) if in_workspace else None
    if not sensitive_match:
        try:
            rel_home = _norm(target.relative_to(home))
            sensitive_match = _match(rel_home, policy.get("home_relative_patterns", []))
        except ValueError:
            pass

    if reasons:
        return {"decision": "block", "canonical_path": target_s, "reasons": sorted(set(reasons))}
    if sensitive_match:
        if policy.get("require_human_approval", True) and not request.get("human_approved", False):
            return {"decision": "require_approval", "canonical_path": target_s, "reasons": [f"execution_sensitive:{sensitive_match}"]}
        return {"decision": "allow", "canonical_path": target_s, "reasons": [f"approved_sensitive:{sensitive_match}"]}
    return {"decision": "allow", "canonical_path": target_s, "reasons": ["ordinary_workspace_write"]}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--request", required=True)
    ap.add_argument("--policy", required=True)
    args = ap.parse_args()
    try:
        request = json.loads(Path(args.request).read_text(encoding="utf-8"))
        policy = json.loads(Path(args.policy).read_text(encoding="utf-8"))
        result = evaluate(request, policy)
    except Exception as exc:
        print(json.dumps({"decision": "block", "reasons": [f"guard_error:{exc}"]}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return {"allow": 0, "require_approval": 3, "block": 4}.get(result["decision"], 2)


if __name__ == "__main__":
    raise SystemExit(main())
