#!/usr/bin/env python3
import argparse, json, os, sys
from pathlib import Path

def resolve_target(workspace: Path, target: str) -> Path:
    raw = Path(target)
    candidate = raw if raw.is_absolute() else workspace / raw
    if candidate.exists() or candidate.is_symlink():
        return candidate.resolve(strict=True)
    parent = candidate.parent.resolve(strict=True)
    return parent / candidate.name

def within(child: Path, parent: Path) -> bool:
    try:
        child.relative_to(parent)
        return True
    except ValueError:
        return False

def evaluate(policy, workspace, target, operation, human_approved=False):
    try:
        ws = Path(workspace).resolve(strict=True)
        resolved = resolve_target(ws, target)
    except Exception as exc:
        return {"ok": False, "decision": "block", "reason": "resolution_error", "detail": str(exc)}
    if operation not in policy.get("allow_operations", []):
        return {"ok": False, "decision": "block", "reason": "operation_not_allowed", "resolved": str(resolved)}
    if not within(resolved, ws):
        if policy.get("require_human_approval_outside_workspace", True) and not human_approved:
            return {"ok": False, "decision": "block", "reason": "outside_workspace", "resolved": str(resolved)}
        return {"ok": False, "decision": "block", "reason": "outside_workspace_even_with_approval", "resolved": str(resolved)}
    rel = resolved.relative_to(ws).as_posix()
    for prefix in policy.get("deny_prefixes", []):
        p = prefix.strip("/")
        if rel == p or rel.startswith(p + "/"):
            return {"ok": False, "decision": "block", "reason": "denied_prefix", "resolved": str(resolved), "matched": p}
    return {"ok": True, "decision": "allow", "reason": "inside_workspace", "resolved": str(resolved)}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--policy", required=True)
    ap.add_argument("--workspace", required=True)
    ap.add_argument("--target", required=True)
    ap.add_argument("--operation", required=True)
    ap.add_argument("--human-approved", action="store_true")
    args = ap.parse_args()
    try:
        policy = json.loads(Path(args.policy).read_text(encoding="utf-8"))
        result = evaluate(policy, args.workspace, args.target, args.operation, args.human_approved)
    except Exception as exc:
        print(json.dumps({"ok": False, "decision": "block", "reason": "invalid_input", "detail": str(exc)}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3

if __name__ == "__main__":
    raise SystemExit(main())
