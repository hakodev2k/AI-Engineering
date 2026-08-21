#!/usr/bin/env python3
"""Deterministic MCP tool-manifest baseline and drift gate.

Input manifest shape:
{
  "server": {"identity": "https://example/mcp", "version": "1.2.3"},
  "tools": [{"name": "x", "description": "...", "inputSchema": {...}, ...}]
}

Commands:
  snapshot --manifest current.json --baseline approved.json --approval-id TICKET-123
  check    --manifest current.json --baseline approved.json [--policy policy.json] [--report report.json]

Exit codes:
  0 = pass / snapshot written
  2 = drift blocked by policy
  3 = invalid input or policy
  4 = I/O/runtime error

The script never contacts a server, never invokes a tool, and never updates a baseline
from `check`. A baseline update requires the explicit `snapshot` command and approval id.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
import os
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

DEFAULT_POLICY = {
    "version": 1,
    "canonicalization": {
        "sort_tool_list_by_name": True,
        "sort_object_keys": True,
        "ignore_tool_fields": ["_meta.traceparent", "_meta.requestId"],
    },
    "risk": {
        "new_tool": "high",
        "removed_tool": "medium",
        "description_changed": "high",
        "input_schema_changed": "high",
        "output_schema_changed": "medium",
        "annotations_changed": "high",
        "server_identity_changed": "critical",
    },
    "gate": {"block_levels": ["high", "critical"]},
    "limits": {"max_tools": 2000, "max_manifest_bytes": 10 * 1024 * 1024},
}
LEVELS = {"low": 1, "medium": 2, "high": 3, "critical": 4}


def fail(msg: str, code: int = 3) -> None:
    print(f"manifest_guard: {msg}", file=sys.stderr)
    raise SystemExit(code)


def load_json(path: Path, max_bytes: int | None = None) -> Any:
    try:
        size = path.stat().st_size
        if max_bytes is not None and size > max_bytes:
            fail(f"{path} exceeds max size {max_bytes} bytes")
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        fail(f"file not found: {path}")
    except json.JSONDecodeError as e:
        fail(f"invalid JSON in {path}: {e}")
    except OSError as e:
        fail(f"cannot read {path}: {e}", 4)


def merge_policy(raw: Any | None) -> dict[str, Any]:
    p = copy.deepcopy(DEFAULT_POLICY)
    if raw is None:
        return p
    if not isinstance(raw, dict):
        fail("policy must be a JSON object")
    for section in ("canonicalization", "risk", "gate", "limits"):
        if section in raw:
            if not isinstance(raw[section], dict):
                fail(f"policy.{section} must be an object")
            p[section].update(raw[section])
    block = p["gate"].get("block_levels", [])
    if not isinstance(block, list) or any(x not in LEVELS for x in block):
        fail("gate.block_levels contains invalid risk level")
    return p


def delete_path(obj: dict[str, Any], dotted: str) -> None:
    parts = dotted.split(".")
    cur: Any = obj
    for part in parts[:-1]:
        if not isinstance(cur, dict) or part not in cur:
            return
        cur = cur[part]
    if isinstance(cur, dict):
        cur.pop(parts[-1], None)


def normalize_json(value: Any) -> Any:
    if isinstance(value, dict):
        return {k: normalize_json(value[k]) for k in sorted(value)}
    if isinstance(value, list):
        return [normalize_json(v) for v in value]
    return value


def canonicalize(manifest: Any, policy: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(manifest, dict):
        fail("manifest must be an object")
    server = manifest.get("server", {})
    tools = manifest.get("tools")
    if not isinstance(server, dict) or not isinstance(tools, list):
        fail("manifest requires object `server` and array `tools`")
    max_tools = int(policy["limits"].get("max_tools", 2000))
    if len(tools) > max_tools:
        fail(f"manifest has {len(tools)} tools; max is {max_tools}")

    names: set[str] = set()
    cleaned: list[dict[str, Any]] = []
    ignores = policy["canonicalization"].get("ignore_tool_fields", [])
    for idx, tool in enumerate(tools):
        if not isinstance(tool, dict) or not isinstance(tool.get("name"), str) or not tool["name"]:
            fail(f"tool[{idx}] requires non-empty string name")
        name = tool["name"]
        if name in names:
            fail(f"duplicate tool name: {name}")
        names.add(name)
        t = copy.deepcopy(tool)
        for dotted in ignores:
            if isinstance(dotted, str):
                delete_path(t, dotted)
        cleaned.append(normalize_json(t))

    if policy["canonicalization"].get("sort_tool_list_by_name", True):
        cleaned.sort(key=lambda x: x["name"])
    canonical = {"server": normalize_json(server), "tools": cleaned}
    return normalize_json(canonical)


def digest(canonical: dict[str, Any]) -> str:
    raw = json.dumps(canonical, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return "sha256:" + hashlib.sha256(raw).hexdigest()


def index_tools(c: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {t["name"]: t for t in c["tools"]}


def add_change(changes: list[dict[str, Any]], kind: str, tool: str | None, before: Any, after: Any,
               policy: dict[str, Any]) -> None:
    risk = policy["risk"].get(kind, "high")
    if risk not in LEVELS:
        fail(f"invalid configured risk `{risk}` for {kind}")
    changes.append({"kind": kind, "tool": tool, "risk": risk, "before": before, "after": after})


def compare(old: dict[str, Any], new: dict[str, Any], policy: dict[str, Any]) -> list[dict[str, Any]]:
    changes: list[dict[str, Any]] = []
    old_id = old.get("server", {}).get("identity")
    new_id = new.get("server", {}).get("identity")
    if old_id != new_id:
        add_change(changes, "server_identity_changed", None, old_id, new_id, policy)

    a, b = index_tools(old), index_tools(new)
    for name in sorted(b.keys() - a.keys()):
        add_change(changes, "new_tool", name, None, b[name], policy)
    for name in sorted(a.keys() - b.keys()):
        add_change(changes, "removed_tool", name, a[name], None, policy)
    for name in sorted(a.keys() & b.keys()):
        x, y = a[name], b[name]
        fields = [
            ("description", "description_changed"),
            ("inputSchema", "input_schema_changed"),
            ("outputSchema", "output_schema_changed"),
            ("annotations", "annotations_changed"),
        ]
        covered = {f for f, _ in fields} | {"name"}
        for field, kind in fields:
            if x.get(field) != y.get(field):
                add_change(changes, kind, name, x.get(field), y.get(field), policy)
        # Any unclassified security-relevant metadata change is conservative high risk.
        extra_x = {k: v for k, v in x.items() if k not in covered}
        extra_y = {k: v for k, v in y.items() if k not in covered}
        if extra_x != extra_y:
            add_change(changes, "annotations_changed", name, extra_x, extra_y, policy)
    return changes


def atomic_write(path: Path, obj: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix=path.name + ".", dir=str(path.parent))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(obj, f, indent=2, ensure_ascii=False, sort_keys=True)
            f.write("\n")
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp, path)
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def cmd_snapshot(args: argparse.Namespace) -> int:
    if not args.approval_id.strip():
        fail("snapshot requires non-empty --approval-id")
    policy = merge_policy(load_json(args.policy) if args.policy else None)
    manifest = load_json(args.manifest, int(policy["limits"]["max_manifest_bytes"]))
    canonical = canonicalize(manifest, policy)
    baseline = {
        "format": "mcp-tool-approval-baseline/v1",
        "approval": {
            "id": args.approval_id,
            "approved_at": datetime.now(timezone.utc).isoformat(),
        },
        "digest": digest(canonical),
        "manifest": canonical,
    }
    try:
        atomic_write(args.baseline, baseline)
    except OSError as e:
        fail(f"cannot write baseline: {e}", 4)
    print(json.dumps({"status": "snapshotted", "digest": baseline["digest"], "tools": len(canonical["tools"])}))
    return 0


def cmd_check(args: argparse.Namespace) -> int:
    policy = merge_policy(load_json(args.policy) if args.policy else None)
    manifest = canonicalize(load_json(args.manifest, int(policy["limits"]["max_manifest_bytes"])), policy)
    baseline = load_json(args.baseline)
    if not isinstance(baseline, dict) or baseline.get("format") != "mcp-tool-approval-baseline/v1":
        fail("unsupported or invalid baseline")
    old = baseline.get("manifest")
    if not isinstance(old, dict):
        fail("baseline manifest missing")
    changes = compare(old, manifest, policy)
    blocked_levels = set(policy["gate"].get("block_levels", []))
    blocked = [c for c in changes if c["risk"] in blocked_levels]
    report = {
        "status": "blocked" if blocked else "pass",
        "approved_digest": baseline.get("digest"),
        "current_digest": digest(manifest),
        "approval_id": baseline.get("approval", {}).get("id"),
        "changes": changes,
        "blocked_changes": len(blocked),
    }
    if args.report:
        try:
            atomic_write(args.report, report)
        except OSError as e:
            fail(f"cannot write report: {e}", 4)
    print(json.dumps(report, ensure_ascii=False, sort_keys=True))
    return 2 if blocked else 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description=__doc__)
    sub = p.add_subparsers(dest="command", required=True)
    for name in ("snapshot", "check"):
        s = sub.add_parser(name)
        s.add_argument("--manifest", type=Path, required=True)
        s.add_argument("--baseline", type=Path, required=True)
        s.add_argument("--policy", type=Path)
        if name == "snapshot":
            s.add_argument("--approval-id", required=True)
        else:
            s.add_argument("--report", type=Path)
    return p


def main() -> int:
    args = build_parser().parse_args()
    try:
        return cmd_snapshot(args) if args.command == "snapshot" else cmd_check(args)
    except SystemExit:
        raise
    except Exception as e:
        print(f"manifest_guard: unexpected error: {e}", file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
