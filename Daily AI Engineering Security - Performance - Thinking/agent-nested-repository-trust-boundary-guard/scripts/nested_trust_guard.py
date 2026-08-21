#!/usr/bin/env python3
"""Read-only nested repository / agent-policy trust-boundary scanner.

Exit codes:
0 pass, 2 policy violation, 3 invalid input, 4 scan error.
"""
from __future__ import annotations
import argparse, json, os, sys
from pathlib import Path


def load_policy(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        raise ValueError(f"cannot load policy: {e}")
    if not isinstance(data.get("protected_metadata_names"), list):
        raise ValueError("policy.protected_metadata_names must be a list")
    return data


def rel(root: Path, p: Path) -> str:
    try:
        return p.relative_to(root).as_posix() or "."
    except ValueError:
        return str(p)


def discover(root: Path, policy: dict) -> list[dict]:
    skip = set(policy.get("skip_directories", []))
    max_depth = int(policy.get("max_scan_depth", 12))
    protected = set(policy.get("protected_metadata_names", []))
    findings: list[dict] = []
    root = root.resolve()

    for current, dirs, files in os.walk(root, followlinks=False):
        cur = Path(current)
        depth = len(cur.relative_to(root).parts)
        if depth >= max_depth:
            dirs[:] = []
            continue
        dirs[:] = [d for d in dirs if d not in skip]

        is_root = cur == root
        git_marker = cur / ".git"
        if git_marker.exists() and not is_root:
            hooks = git_marker / "hooks" if git_marker.is_dir() else None
            hook_files = []
            if hooks and hooks.is_dir():
                hook_files = sorted(
                    rel(root, p) for p in hooks.iterdir()
                    if p.is_file() and not p.name.endswith(".sample")
                )
            findings.append({
                "type": "nested_git_root",
                "path": rel(root, cur),
                "git_marker_kind": "directory" if git_marker.is_dir() else "file",
                "active_hook_files": hook_files,
            })

        for name in (".claude", ".codex", ".agents"):
            p = cur / name
            if p.exists() and not (is_root and name in protected):
                files_found = []
                if p.is_dir():
                    for child in p.iterdir():
                        if child.is_file() and child.name.lower().endswith((".json", ".toml", ".yaml", ".yml", ".md")):
                            files_found.append(rel(root, child))
                findings.append({
                    "type": "nested_agent_config_root",
                    "path": rel(root, p),
                    "config_files": sorted(files_found),
                })
    return findings


def evaluate(findings: list[dict], policy: dict) -> tuple[list[dict], dict]:
    allow = set(policy.get("nested_root_allowlist", []))
    violations = []
    for item in findings:
        path = item["path"]
        approved = path in allow
        reasons = []
        if item["type"] == "nested_git_root":
            if policy.get("fail_on_unknown_nested_root", True) and not approved:
                reasons.append("nested Git root is not explicitly allowlisted")
            if policy.get("fail_on_nested_git_hooks", True) and item.get("active_hook_files"):
                reasons.append("nested Git root contains active hook files")
        elif item["type"] == "nested_agent_config_root":
            if policy.get("fail_on_child_agent_settings", True) and not approved:
                reasons.append("nested agent configuration may alter parent policy")
        if reasons:
            violations.append({"path": path, "type": item["type"], "reasons": reasons})
    metrics = {
        "nested_roots": len([x for x in findings if x["type"] == "nested_git_root"]),
        "nested_agent_config_roots": len([x for x in findings if x["type"] == "nested_agent_config_root"]),
        "active_nested_hooks": sum(len(x.get("active_hook_files", [])) for x in findings),
        "violations": len(violations),
    }
    return violations, metrics


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=".")
    ap.add_argument("--policy", required=True)
    ap.add_argument("--output", help="write JSON report; contains paths/metadata only")
    args = ap.parse_args()
    root = Path(args.root)
    policy_path = Path(args.policy)
    if not root.is_dir() or not policy_path.is_file():
        print("invalid root or policy path", file=sys.stderr)
        return 3
    try:
        policy = load_policy(policy_path)
        findings = discover(root, policy)
        violations, metrics = evaluate(findings, policy)
        report = {
            "schema": 1,
            "root": str(root.resolve()),
            "findings": findings,
            "violations": violations,
            "metrics": metrics,
            "status": "pass" if not violations else "block"
        }
        text = json.dumps(report, indent=2)
        if args.output:
            Path(args.output).write_text(text + "\n", encoding="utf-8")
        print(text)
        return 0 if not violations else 2
    except ValueError as e:
        print(str(e), file=sys.stderr); return 3
    except Exception as e:
        print(f"scan failed: {e}", file=sys.stderr); return 4

if __name__ == "__main__":
    raise SystemExit(main())
