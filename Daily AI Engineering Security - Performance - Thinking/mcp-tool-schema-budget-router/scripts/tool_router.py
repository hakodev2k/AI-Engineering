#!/usr/bin/env python3
"""Select a bounded task-relevant subset of full tool definitions.

Selection is deterministic: essential tools first, then keyword/tag/name overlap,
then lower schema cost, then name. The selected model-visible definitions are
copied without modifying callable schema fields.

Exit codes: 0 success, 2 invalid input/policy, 3 cannot satisfy hard budget.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

from schema_profiler import extract_tools, model_visible, estimate_tokens, definition_hash, read_json, read_policy, profile

WORD_RE = re.compile(r"[a-z0-9_.-]+")


def words(text: str) -> set[str]:
    return set(WORD_RE.findall(text.lower()))


def routing_meta(tool: dict[str, Any]) -> dict[str, Any]:
    value = tool.get("routing", {})
    return value if isinstance(value, dict) else {}


def score(tool: dict[str, Any], task_terms: set[str]) -> int:
    meta = routing_meta(tool)
    tokens: set[str] = set()
    name = tool.get("name")
    if isinstance(name, str):
        tokens |= words(name.replace("_", " ").replace("-", " "))
    for key in ("tags", "keywords"):
        values = meta.get(key, [])
        if isinstance(values, list):
            for value in values:
                if isinstance(value, str):
                    tokens |= words(value)
    summary = meta.get("summary")
    if isinstance(summary, str):
        tokens |= words(summary)
    overlap = task_terms & tokens
    return len(overlap)


def is_essential(tool: dict[str, Any], essential_tags: set[str]) -> bool:
    tags = routing_meta(tool).get("tags", [])
    if not isinstance(tags, list):
        return False
    return bool(essential_tags & {str(x) for x in tags})


def route(catalog: Any, task_text: str, policy: dict[str, Any], fallback: bool = False) -> tuple[dict[str, Any], dict[str, Any]]:
    baseline = profile(catalog, policy)
    if not baseline["valid"]:
        raise ValueError("invalid catalog: " + "; ".join(baseline["errors"]))

    tools = extract_tools(catalog)
    budgets = policy.get("budgets", {})
    selection = policy.get("selection", {})
    max_tokens = int(budgets.get("maxToolSchemaTokens", 6000))
    max_tools = int(budgets.get("maxSelectedTools", 12))
    min_essential = int(budgets.get("minEssentialTools", 0))
    chars_per_token = float(policy.get("estimatedCharsPerToken", 4.0))
    essential_tags = {str(x) for x in selection.get("essentialTags", ["essential"])}
    min_score = int(selection.get("minimumKeywordScore", 1))
    fallback_additional = int(selection.get("fallbackAdditionalTools", 3))

    task_terms = words(task_text)
    rows: list[dict[str, Any]] = []
    for tool in tools:
        visible = model_visible(tool)
        rows.append({
            "tool": tool,
            "name": str(tool.get("name", "")),
            "tokens": estimate_tokens(visible, chars_per_token),
            "hash": definition_hash(tool),
            "essential": is_essential(tool, essential_tags),
            "score": score(tool, task_terms),
        })

    essentials = sorted([r for r in rows if r["essential"]], key=lambda r: (r["tokens"], r["name"]))
    if len(essentials) < min_essential:
        raise ValueError(f"catalog has {len(essentials)} essential tools but policy requires {min_essential}")

    selected: list[dict[str, Any]] = []
    selected_names: set[str] = set()
    used_tokens = 0

    def add(row: dict[str, Any], reason: str) -> bool:
        nonlocal used_tokens
        if row["name"] in selected_names:
            return True
        if len(selected) >= max_tools or used_tokens + row["tokens"] > max_tokens:
            return False
        copy = dict(row)
        copy["reason"] = reason
        selected.append(copy)
        selected_names.add(row["name"])
        used_tokens += row["tokens"]
        return True

    for row in essentials:
        if not add(row, "essential"):
            raise RuntimeError("essential tools exceed configured schema/count budget")

    candidates = [r for r in rows if not r["essential"]]
    if fallback:
        candidates.sort(key=lambda r: (r["tokens"], r["name"]))
        added = 0
        for row in candidates:
            if added >= fallback_additional:
                break
            if add(row, "bounded-fallback"):
                added += 1
    else:
        candidates.sort(key=lambda r: (-r["score"], r["tokens"], r["name"]))
        for row in candidates:
            if row["score"] < min_score:
                continue
            add(row, f"keyword-score:{row['score']}")

        if len(selected) == len(essentials):
            mode = str(selection.get("fallbackMode", "essential-plus-smallest"))
            if mode == "essential-plus-smallest":
                for row in sorted(candidates, key=lambda r: (r["tokens"], r["name"]))[:fallback_additional]:
                    add(row, "no-match-fallback")

    selected_tools = [model_visible(r["tool"]) for r in selected]
    selected_token_sum = sum(r["tokens"] for r in selected)
    before = int(baseline["estimated_tokens"])
    reduction = 0.0 if before <= 0 else 1.0 - (selected_token_sum / before)

    rejected: list[dict[str, Any]] = []
    for row in rows:
        if row["name"] not in selected_names:
            rejected.append({
                "name": row["name"],
                "estimated_tokens": row["tokens"],
                "score": row["score"],
                "reason": "not-selected-or-budget",
            })

    report = {
        "valid": True,
        "fallback": fallback,
        "catalog_tool_count": len(rows),
        "selected_tool_count": len(selected),
        "catalog_estimated_tokens": before,
        "selected_estimated_tokens": selected_token_sum,
        "schema_token_reduction_ratio": round(reduction, 6),
        "budget_tokens": max_tokens,
        "selected": [
            {
                "name": r["name"],
                "estimated_tokens": r["tokens"],
                "score": r["score"],
                "essential": r["essential"],
                "definition_sha256": r["hash"],
                "reason": r["reason"],
            }
            for r in selected
        ],
        "rejected": rejected,
    }
    return {"tools": selected_tools}, report


def write_json(path: str, data: Any) -> None:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    p = argparse.ArgumentParser(description="Budgeted deterministic tool router")
    p.add_argument("--catalog", required=True)
    task = p.add_mutually_exclusive_group(required=True)
    task.add_argument("--task")
    task.add_argument("--task-file")
    p.add_argument("--policy", required=True)
    p.add_argument("--output", required=True)
    p.add_argument("--report", required=True)
    p.add_argument("--fallback", action="store_true")
    args = p.parse_args()

    try:
        catalog = read_json(args.catalog)
        policy = read_policy(args.policy)
        if args.task_file:
            task_text = Path(args.task_file).read_text(encoding="utf-8")
        else:
            task_text = args.task or ""
        selected, report = route(catalog, task_text, policy, args.fallback)
        write_json(args.output, selected)
        write_json(args.report, report)
    except RuntimeError as exc:
        print(json.dumps({"valid": False, "error": str(exc)}), file=sys.stderr)
        return 3
    except (ValueError, OSError) as exc:
        print(json.dumps({"valid": False, "error": str(exc)}), file=sys.stderr)
        return 2

    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
