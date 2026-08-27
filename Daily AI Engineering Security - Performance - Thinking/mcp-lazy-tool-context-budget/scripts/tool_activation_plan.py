#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path


def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"cannot_read:{exc}"}))
        raise SystemExit(2)


def plan(inventory, budget, task):
    tools = inventory.get("tools")
    if not isinstance(tools, list):
        return {"ok": False, "decision": "block", "reasons": ["invalid_inventory"]}

    max_tokens = int(budget.get("max_schema_tokens", 12000))
    max_startup = int(budget.get("max_startup_ms", 1500))
    min_rel = float(budget.get("minimum_relevance", 0.35))
    required_names = set(task.get("required_tools", []))
    required_tags = set(task.get("required_tags", [])) | set(budget.get("required_tags", []))

    normalized = []
    for raw in tools:
        try:
            item = {
                "name": str(raw["name"]),
                "schema_tokens": int(raw.get("schema_tokens", 0)),
                "startup_ms": int(raw.get("startup_ms", 0)),
                "critical": bool(raw.get("critical", False)),
                "tags": set(raw.get("tags", [])),
                "relevance": float(raw.get("relevance", 0.0)),
            }
        except Exception:
            return {"ok": False, "decision": "block", "reasons": ["invalid_tool_record"]}
        item["required"] = item["critical"] or item["name"] in required_names or bool(item["tags"] & required_tags)
        normalized.append(item)

    required = [x for x in normalized if x["required"]]
    optional = [x for x in normalized if not x["required"] and x["relevance"] >= min_rel]
    optional.sort(key=lambda x: (-x["relevance"], x["schema_tokens"], x["startup_ms"], x["name"]))

    selected = list(required)
    used_tokens = sum(x["schema_tokens"] for x in selected)
    used_startup = sum(x["startup_ms"] for x in selected)
    if used_tokens > max_tokens or used_startup > max_startup:
        return {"ok": False, "decision": "block", "reasons": ["required_capabilities_exceed_budget"],
                "required_schema_tokens": used_tokens, "required_startup_ms": used_startup}

    for item in optional:
        if used_tokens + item["schema_tokens"] <= max_tokens and used_startup + item["startup_ms"] <= max_startup:
            selected.append(item)
            used_tokens += item["schema_tokens"]
            used_startup += item["startup_ms"]

    selected_names = {x["name"] for x in selected}
    deferred = [x["name"] for x in normalized if x["name"] not in selected_names]
    baseline_tokens = sum(x["schema_tokens"] for x in normalized)
    baseline_startup = sum(x["startup_ms"] for x in normalized)
    return {
        "ok": True,
        "decision": "activate_budgeted",
        "active_tools": sorted(selected_names),
        "deferred_tools": sorted(deferred),
        "schema_tokens_before": baseline_tokens,
        "schema_tokens_after": used_tokens,
        "schema_tokens_saved": baseline_tokens - used_tokens,
        "startup_ms_before": baseline_startup,
        "startup_ms_after": used_startup,
        "startup_ms_saved": baseline_startup - used_startup,
    }


def main():
    ap = argparse.ArgumentParser(description="Create a task-aware MCP/tool activation plan within token and startup budgets.")
    ap.add_argument("--inventory", required=True)
    ap.add_argument("--budget", required=True)
    ap.add_argument("--task", required=True)
    args = ap.parse_args()
    result = plan(load(args.inventory), load(args.budget), load(args.task))
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    sys.exit(main())
