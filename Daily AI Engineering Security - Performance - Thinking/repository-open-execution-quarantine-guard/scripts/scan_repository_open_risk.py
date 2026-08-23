#!/usr/bin/env python3
"""Static pre-open scanner for repository-controlled auto-execution surfaces."""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path

RISK_FILES = (".claude/settings.json", ".vscode/tasks.json", "package.json", ".devcontainer/devcontainer.json")
DEVCONTAINER_KEYS = {"initializeCommand", "onCreateCommand", "updateContentCommand", "postCreateCommand", "postStartCommand", "postAttachCommand"}
INSTALL_SCRIPTS = {"preinstall", "install", "postinstall"}

def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()

def load_json(path: Path):
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)

def flatten_hook_commands(node):
    out = []
    if isinstance(node, dict):
        if isinstance(node.get("command"), str): out.append(node["command"])
        for v in node.values(): out.extend(flatten_hook_commands(v))
    elif isinstance(node, list):
        for v in node: out.extend(flatten_hook_commands(v))
    return out

def finding(path, trigger, evidence, severity="high", blocking=True):
    return {"path": path, "trigger": trigger, "evidence": evidence, "severity": severity, "blocking": blocking}

def scan_file(root: Path, rel: str):
    path = root / rel
    if not path.is_file(): return []
    data = load_json(path)
    result = []
    if rel == ".claude/settings.json":
        hooks = data.get("hooks", {}) if isinstance(data, dict) else {}
        for event, cfg in hooks.items() if isinstance(hooks, dict) else []:
            commands = flatten_hook_commands(cfg)
            if commands:
                result.append(finding(rel, f"claude-hook:{event}", {"commands": commands}, "high", event.lower() in {"sessionstart", "startup"}))
    elif rel == ".vscode/tasks.json":
        for task in data.get("tasks", []) if isinstance(data, dict) else []:
            run_on = (task.get("runOptions") or {}).get("runOn") if isinstance(task, dict) else None
            if run_on == "folderOpen":
                result.append(finding(rel, "vscode:folderOpen", {"label": task.get("label"), "command": task.get("command"), "args": task.get("args", [])}))
    elif rel == "package.json":
        scripts = data.get("scripts", {}) if isinstance(data, dict) else {}
        for name in sorted(INSTALL_SCRIPTS & set(scripts)):
            result.append(finding(rel, f"npm:{name}", {"command": scripts[name]}, "medium", False))
    elif rel == ".devcontainer/devcontainer.json":
        for key in sorted(DEVCONTAINER_KEYS & set(data if isinstance(data, dict) else {})):
            result.append(finding(rel, f"devcontainer:{key}", {"command": data[key]}, "high", key in {"initializeCommand", "onCreateCommand", "postCreateCommand"}))
    digest = sha256(path)
    for item in result: item["sha256"] = digest
    return result

def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("repository")
    p.add_argument("--approval-file")
    p.add_argument("--json", action="store_true")
    args = p.parse_args()
    root = Path(args.repository).resolve()
    if not root.is_dir():
        print("repository path is not a directory", file=sys.stderr); return 1
    approvals = {}
    try:
        if args.approval_file:
            approvals = load_json(Path(args.approval_file))
            if not isinstance(approvals, dict): raise ValueError("approval file must be an object")
        findings = []
        for rel in RISK_FILES:
            try: findings.extend(scan_file(root, rel))
            except (OSError, json.JSONDecodeError, UnicodeError) as e:
                findings.append(finding(rel, "parse-failure", {"error": str(e)}, "high", True))
        for item in findings:
            item["approved"] = bool(item.get("sha256") and approvals.get(item["path"]) == item["sha256"])
            item["blocking_unapproved"] = bool(item["blocking"] and not item["approved"])
        payload = {"repository": str(root), "findings": findings, "blocking": sum(1 for x in findings if x["blocking_unapproved"])}
        if args.json: print(json.dumps(payload, indent=2, sort_keys=True))
        else:
            for x in findings: print(f"[{ 'BLOCK' if x['blocking_unapproved'] else 'INFO' }] {x['path']} {x['trigger']} sha256={x.get('sha256','n/a')}")
            print(f"blocking={payload['blocking']} findings={len(findings)}")
        return 2 if payload["blocking"] else 0
    except (OSError, ValueError, json.JSONDecodeError) as e:
        print(f"scanner failure: {e}", file=sys.stderr); return 1

if __name__ == "__main__": raise SystemExit(main())
