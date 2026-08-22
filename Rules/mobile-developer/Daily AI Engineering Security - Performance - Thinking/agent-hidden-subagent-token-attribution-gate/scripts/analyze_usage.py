#!/usr/bin/env python3
"""Normalize agent/subagent token telemetry and enforce budgets.

Input: JSON or JSONL. Each record may use normalized fields directly or common
provider-style usage fields. Unknown combined subagent totals are preserved as
unknown_tokens rather than guessed into input/output classes.

Exit codes:
  0: analysis completed and all enforced budgets pass
  2: policy/budget violation
  3: invalid input/config
  4: I/O error
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Iterable


@dataclass
class Usage:
    task_id: str
    agent_id: str
    parent_id: str | None
    role: str
    is_child: bool
    input_tokens: int = 0
    output_tokens: int = 0
    cache_read_tokens: int = 0
    cache_write_tokens: int = 0
    unknown_tokens: int = 0
    completed: bool = False

    @property
    def total(self) -> int:
        return (
            self.input_tokens
            + self.output_tokens
            + self.cache_read_tokens
            + self.cache_write_tokens
            + self.unknown_tokens
        )


def nonneg_int(value: Any, name: str) -> int:
    if value is None:
        return 0
    if isinstance(value, bool):
        raise ValueError(f"{name} must be a non-negative integer")
    try:
        n = int(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{name} must be a non-negative integer") from exc
    if n < 0:
        raise ValueError(f"{name} must be non-negative")
    return n


def first(obj: dict[str, Any], *paths: str) -> Any:
    for path in paths:
        cur: Any = obj
        ok = True
        for part in path.split("."):
            if not isinstance(cur, dict) or part not in cur:
                ok = False
                break
            cur = cur[part]
        if ok and cur is not None:
            return cur
    return None


def normalize(obj: dict[str, Any], index: int) -> Usage:
    usage = first(obj, "usage")
    if not isinstance(usage, dict):
        usage = obj

    agent_id = str(first(obj, "agent_id", "agentId", "session_id", "sessionId", "id") or f"record-{index}")
    parent_raw = first(obj, "parent_id", "parentId", "parent_agent_id", "parentAgentId", "parentUuid")
    parent_id = str(parent_raw) if parent_raw not in (None, "") else None
    task_id = str(first(obj, "task_id", "taskId", "root_task_id", "rootTaskId") or parent_id or agent_id)
    role = str(first(obj, "role", "agent_role", "agentRole", "feature", "source.subagent.other") or ("child" if parent_id else "root"))
    is_child = bool(first(obj, "is_child", "isChild") if first(obj, "is_child", "isChild") is not None else parent_id)

    input_tokens = nonneg_int(first(usage, "input_tokens", "inputTokens"), "input_tokens")
    output_tokens = nonneg_int(first(usage, "output_tokens", "outputTokens"), "output_tokens")
    cache_read = nonneg_int(first(usage, "cache_read_input_tokens", "cache_read_tokens", "cacheReadInputTokens"), "cache_read_tokens")
    cache_write = nonneg_int(first(usage, "cache_creation_input_tokens", "cache_write_tokens", "cacheCreationInputTokens"), "cache_write_tokens")

    combined = first(usage, "subagent_tokens", "total_tokens", "totalTokens")
    known = input_tokens + output_tokens + cache_read + cache_write
    unknown = 0
    if combined is not None:
        combined_n = nonneg_int(combined, "combined tokens")
        # Preserve only the unexplained remainder. Never guess a token-class split.
        unknown = max(0, combined_n - known)

    completed_raw = first(obj, "completed", "is_completed", "isCompleted")
    completed = bool(completed_raw)

    return Usage(
        task_id=task_id,
        agent_id=agent_id,
        parent_id=parent_id,
        role=role,
        is_child=is_child,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        cache_read_tokens=cache_read,
        cache_write_tokens=cache_write,
        unknown_tokens=unknown,
        completed=completed,
    )


def read_records(path: Path) -> list[dict[str, Any]]:
    text = path.read_text(encoding="utf-8").strip()
    if not text:
        return []
    if text.startswith("["):
        data = json.loads(text)
        if not isinstance(data, list) or not all(isinstance(x, dict) for x in data):
            raise ValueError("JSON input must be an array of objects")
        return data
    records: list[dict[str, Any]] = []
    for line_no, line in enumerate(text.splitlines(), 1):
        if not line.strip():
            continue
        value = json.loads(line)
        if not isinstance(value, dict):
            raise ValueError(f"line {line_no}: expected object")
        records.append(value)
    return records


def load_policy(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or not isinstance(data.get("defaults"), dict):
        raise ValueError("policy must contain a defaults object")
    return data


def aggregate(events: Iterable[Usage]) -> dict[str, Any]:
    by_agent: dict[str, dict[str, Any]] = {}
    by_task: dict[str, dict[str, Any]] = defaultdict(lambda: {
        "total_tokens": 0,
        "unknown_tokens": 0,
        "child_tokens": 0,
        "children": set(),
        "roles": defaultdict(int),
        "completed_children": set(),
    })

    for e in events:
        row = by_agent.setdefault(e.agent_id, {
            "task_id": e.task_id,
            "agent_id": e.agent_id,
            "parent_id": e.parent_id,
            "role": e.role,
            "is_child": e.is_child,
            "input_tokens": 0,
            "output_tokens": 0,
            "cache_read_tokens": 0,
            "cache_write_tokens": 0,
            "unknown_tokens": 0,
            "total_tokens": 0,
            "completed": False,
        })
        for field in ("input_tokens", "output_tokens", "cache_read_tokens", "cache_write_tokens", "unknown_tokens"):
            row[field] += getattr(e, field)
        row["total_tokens"] += e.total
        row["completed"] = row["completed"] or e.completed

        task = by_task[e.task_id]
        task["total_tokens"] += e.total
        task["unknown_tokens"] += e.unknown_tokens
        if e.is_child:
            task["child_tokens"] += e.total
            task["children"].add(e.agent_id)
            task["roles"][e.role] += e.total
            if e.completed:
                task["completed_children"].add(e.agent_id)

    tasks: dict[str, Any] = {}
    for task_id, t in by_task.items():
        total = t["total_tokens"]
        child = t["child_tokens"]
        completed = len(t["completed_children"])
        tasks[task_id] = {
            "total_tokens": total,
            "unknown_tokens": t["unknown_tokens"],
            "unknown_token_ratio": (t["unknown_tokens"] / total) if total else 0.0,
            "child_tokens": child,
            "child_token_share": (child / total) if total else 0.0,
            "child_count": len(t["children"]),
            "tokens_per_completed_child": (child / completed) if completed else None,
            "roles": dict(sorted(t["roles"].items())),
        }
    return {"agents": by_agent, "tasks": tasks}


def effective_limit(policy: dict[str, Any], role: str, key: str) -> Any:
    role_cfg = policy.get("roles", {}).get(role, {})
    if key in role_cfg:
        return role_cfg[key]
    return policy["defaults"].get(key)


def enforce(summary: dict[str, Any], policy: dict[str, Any]) -> list[str]:
    violations: list[str] = []
    defaults = policy["defaults"]
    enforcement = policy.get("enforcement", {})

    for agent_id, a in summary["agents"].items():
        if a["is_child"]:
            if enforcement.get("require_parent_id_for_children", True) and not a["parent_id"]:
                violations.append(f"agent {agent_id}: child missing parent_id")
            if enforcement.get("require_role_for_children", True) and a["role"] in ("", "child"):
                violations.append(f"agent {agent_id}: child missing explicit role")
            limit = effective_limit(policy, a["role"], "max_tokens_per_child")
            if limit is not None and a["total_tokens"] > int(limit):
                violations.append(f"agent {agent_id}: {a['total_tokens']} tokens exceeds child limit {limit} for role {a['role']}")

    for task_id, t in summary["tasks"].items():
        max_children = defaults.get("max_children_per_parent")
        if max_children is not None and t["child_count"] > int(max_children):
            violations.append(f"task {task_id}: {t['child_count']} children exceeds {max_children}")
        max_tree = defaults.get("max_total_tokens_per_parent_tree")
        if max_tree is not None and t["total_tokens"] > int(max_tree):
            violations.append(f"task {task_id}: {t['total_tokens']} total tokens exceeds {max_tree}")
        max_unknown = defaults.get("max_unknown_token_ratio")
        if max_unknown is not None and t["unknown_token_ratio"] > float(max_unknown):
            violations.append(f"task {task_id}: unknown token ratio {t['unknown_token_ratio']:.3f} exceeds {max_unknown}")
        max_share = defaults.get("max_child_token_share")
        if max_share is not None and t["child_token_share"] > float(max_share):
            violations.append(f"task {task_id}: child token share {t['child_token_share']:.3f} exceeds {max_share}")
        for role, tokens in t["roles"].items():
            role_limit = effective_limit(policy, role, "max_total_tokens_per_parent_tree")
            if role_limit is not None and tokens > int(role_limit):
                violations.append(f"task {task_id}: role {role} used {tokens} tokens, exceeds {role_limit}")
    return violations


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="JSON or JSONL usage telemetry")
    parser.add_argument("--policy", type=Path, required=True, help="budget policy JSON")
    parser.add_argument("--report", type=Path, help="write normalized report JSON")
    args = parser.parse_args()

    try:
        records = read_records(args.input)
        policy = load_policy(args.policy)
        events = [normalize(obj, i + 1) for i, obj in enumerate(records)]
        summary = aggregate(events)
        violations = enforce(summary, policy)
        report = {
            "status": "fail" if violations else "pass",
            "record_count": len(records),
            "normalized_events": [asdict(e) | {"total_tokens": e.total} for e in events],
            "summary": summary,
            "violations": violations,
        }
        rendered = json.dumps(report, indent=2, sort_keys=True)
        if args.report:
            args.report.write_text(rendered + "\n", encoding="utf-8")
        else:
            print(rendered)
        return 2 if violations and policy.get("enforcement", {}).get("fail_on_budget_breach", True) else 0
    except (ValueError, json.JSONDecodeError) as exc:
        print(f"invalid input: {exc}", file=sys.stderr)
        return 3
    except OSError as exc:
        print(f"I/O error: {exc}", file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
