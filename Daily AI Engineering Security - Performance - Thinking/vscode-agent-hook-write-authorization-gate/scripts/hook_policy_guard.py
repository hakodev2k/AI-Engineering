#!/usr/bin/env python3
import argparse, json, os, re, shlex
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot_parse_json:{path}:{exc}") from exc


def is_sensitive(path, fragments):
    norm = str(path).replace("\\", "/")
    return any(frag in norm or norm.startswith(frag.lstrip("/")) for frag in fragments)


def collect_commands(obj):
    found = []
    if isinstance(obj, dict):
        for key, value in obj.items():
            if key.lower() in {"command", "cmd", "shell"} and isinstance(value, str):
                found.append(value)
            found.extend(collect_commands(value))
    elif isinstance(obj, list):
        for item in obj:
            found.extend(collect_commands(item))
    return found


def evaluate(file_path, workspace, policy, approved=False):
    if not is_sensitive(file_path, policy.get("sensitive_path_fragments", [])):
        return {"ok": True, "decision": "not_sensitive", "commands": 0, "reasons": []}

    data = load_json(file_path)
    commands = collect_commands(data)
    if not commands:
        return {"ok": True, "decision": "sensitive_non_executable", "commands": 0, "reasons": []}

    workspace_real = os.path.realpath(workspace)
    blocked = [str(p).casefold() for p in policy.get("blocked_command_patterns", [])]
    reasons = []

    for command in commands:
        low = command.casefold()
        for pattern in blocked:
            if pattern in low:
                reasons.append("blocked_command_pattern:" + pattern)
        if policy.get("forbid_parent_traversal", True) and re.search(r"(^|[\\/])\.\.([\\/]|$)", command):
            reasons.append("parent_traversal_in_command")
        if policy.get("forbid_absolute_command_paths", True):
            try:
                first = shlex.split(command, posix=os.name != "nt")[0]
            except Exception:
                reasons.append("unparseable_command")
                continue
            if os.path.isabs(first):
                first_real = os.path.realpath(first)
                try:
                    common = os.path.commonpath([workspace_real, first_real])
                except ValueError:
                    common = ""
                if common != workspace_real:
                    reasons.append("absolute_command_outside_workspace")

    if reasons:
        return {"ok": False, "decision": "block", "commands": len(commands), "reasons": sorted(set(reasons))}
    if policy.get("require_approval", True) and not approved:
        return {"ok": False, "decision": "require_approval", "commands": len(commands), "reasons": ["executable_hook_change_requires_approval"]}
    return {"ok": True, "decision": "allow_after_approval", "commands": len(commands), "reasons": []}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", required=True)
    parser.add_argument("--workspace", required=True)
    parser.add_argument("--policy", required=True)
    parser.add_argument("--approved", action="store_true")
    args = parser.parse_args()
    try:
        result = evaluate(args.file, args.workspace, load_json(args.policy), args.approved)
    except Exception as exc:
        result = {"ok": False, "decision": "block", "commands": 0, "reasons": [str(exc)]}
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())
