#!/usr/bin/env python3
"""Static/preflight guard for absent protected descendant paths.

This script never creates, deletes, chmods, or ACL-modifies filesystem objects.
It evaluates whether configured protected relative paths sit beneath writable roots
and whether the selected sandbox backend can deny future path creation without
materializing those paths.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any


def load_json(path: str) -> dict[str, Any]:
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read policy {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("policy must be a JSON object")
    return data


def normalize_relative(value: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError("protected path must be a non-empty string")
    p = Path(value)
    if p.is_absolute():
        raise ValueError(f"protected path must be relative: {value}")
    normalized = os.path.normpath(value).replace("\\", "/")
    if normalized == ".." or normalized.startswith("../"):
        raise ValueError(f"protected path escapes workspace: {value}")
    return normalized


def evaluate(workspace: Path, policy: dict[str, Any]) -> dict[str, Any]:
    workspace = workspace.resolve()
    protected_raw = policy.get("protected_relative_paths", [])
    if not isinstance(protected_raw, list) or not protected_raw:
        return {"ok": False, "decision": "block", "reasons": ["no_protected_paths_configured"]}

    writable_roots = policy.get("writable_roots", ["."])
    if not isinstance(writable_roots, list) or not writable_roots:
        return {"ok": False, "decision": "block", "reasons": ["no_writable_roots_configured"]}

    capabilities = policy.get("backend_capabilities", {})
    future_path_deny = bool(capabilities.get("future_path_deny", False))
    requires_materialization = bool(capabilities.get("requires_materialization", False))
    block_absent = bool(policy.get("block_if_unprotected_absent_descendant", True))
    block_materialization = bool(policy.get("block_if_policy_materializes_protected_path", True))

    protected = [normalize_relative(v) for v in protected_raw]
    writable = [normalize_relative(v) for v in writable_roots]
    findings: list[dict[str, Any]] = []

    for rel in protected:
        target = (workspace / rel).resolve(strict=False)
        try:
            target.relative_to(workspace)
        except ValueError:
            return {"ok": False, "decision": "block", "reasons": [f"protected_path_escapes_workspace:{rel}"]}

        covered_by_writable = False
        for root_rel in writable:
            root = (workspace / root_rel).resolve(strict=False)
            try:
                target.relative_to(root)
                covered_by_writable = True
                break
            except ValueError:
                continue

        exists = target.exists() or target.is_symlink()
        state = {
            "path": rel,
            "exists": exists,
            "under_writable_root": covered_by_writable,
            "future_path_deny": future_path_deny,
            "requires_materialization": requires_materialization,
        }
        risks: list[str] = []
        if covered_by_writable and not exists and block_absent and not future_path_deny:
            risks.append("absent_protected_descendant_not_future_denied")
        if not exists and block_materialization and requires_materialization:
            risks.append("policy_would_materialize_protected_path")
        if risks:
            state["risks"] = risks
        findings.append(state)

    reasons = sorted({risk for f in findings for risk in f.get("risks", [])})
    return {
        "ok": not reasons,
        "decision": "allow" if not reasons else "block",
        "workspace": str(workspace),
        "findings": findings,
        "reasons": reasons,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate absent protected-path policy invariants")
    parser.add_argument("--workspace", required=True, help="Workspace root to inspect without mutation")
    parser.add_argument("--policy", required=True, help="Policy JSON")
    args = parser.parse_args()
    try:
        workspace = Path(args.workspace)
        if not workspace.exists() or not workspace.is_dir():
            raise ValueError("workspace must be an existing directory")
        result = evaluate(workspace, load_json(args.policy))
    except Exception as exc:
        print(json.dumps({"ok": False, "decision": "error", "error": str(exc)}), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())
