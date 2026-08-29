#!/usr/bin/env python3
"""Detect successful-but-stagnant tool-search loops from JSONL traces."""
import argparse
import hashlib
import json
import sys


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def fp(value):
    return hashlib.sha256(canonical(value).encode("utf-8")).hexdigest()[:16]


def analyze(rows, max_searches, max_stagnant, max_repeats, max_seconds, search_names):
    searches = 0
    stagnant = 0
    max_streak = 0
    first_ts = None
    last_ts = None
    seen_tools = set()
    pair_counts = {}
    reasons = []
    for index, row in enumerate(rows, 1):
        if not isinstance(row, dict):
            raise ValueError(f"row {index} is not an object")
        tool = str(row.get("tool", ""))
        ts = row.get("ts")
        if isinstance(ts, (int, float)):
            first_ts = ts if first_ts is None else min(first_ts, ts)
            last_ts = ts if last_ts is None else max(last_ts, ts)
        if tool not in search_names:
            continue
        searches += 1
        key = (fp({"tool": tool, "args": row.get("args", {})}), fp(row.get("result")))
        pair_counts[key] = pair_counts.get(key, 0) + 1
        new_tools = {str(x) for x in (row.get("new_tools") or [])}
        actual_new = new_tools - seen_tools
        seen_tools |= new_tools
        if actual_new:
            stagnant = 0
        else:
            stagnant += 1
            max_streak = max(max_streak, stagnant)
        if pair_counts[key] > max_repeats and "repeated_query_result" not in reasons:
            reasons.append("repeated_query_result")
    elapsed = (last_ts - first_ts) if first_ts is not None and last_ts is not None else 0.0
    if searches > max_searches:
        reasons.append("search_budget_exceeded")
    if max_streak > max_stagnant:
        reasons.append("stagnation_budget_exceeded")
    if elapsed > max_seconds:
        reasons.append("time_budget_exceeded")
    return {
        "ok": not reasons,
        "reasons": reasons,
        "search_calls": searches,
        "max_stagnant_streak": max_streak,
        "distinct_tools_discovered": len(seen_tools),
        "elapsed_seconds": elapsed,
        "max_query_result_repeats": max(pair_counts.values(), default=0),
    }


def main():
    p = argparse.ArgumentParser()
    p.add_argument("trace")
    p.add_argument("--max-searches", type=int, default=24)
    p.add_argument("--max-stagnant", type=int, default=6)
    p.add_argument("--max-repeats", type=int, default=3)
    p.add_argument("--max-seconds", type=float, default=180.0)
    p.add_argument("--search-tool", action="append", default=[])
    p.add_argument("--json", action="store_true")
    a = p.parse_args()
    if min(a.max_searches, a.max_stagnant, a.max_repeats) < 0 or a.max_seconds < 0:
        p.error("budgets must be non-negative")
    names = set(a.search_tool or ["tool_search", "tool_search_tool_regex", "discover_tools"])
    try:
        with open(a.trace, "r", encoding="utf-8") as f:
            rows = [json.loads(line) for line in f if line.strip()]
        report = analyze(rows, a.max_searches, a.max_stagnant, a.max_repeats, a.max_seconds, names)
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    print(json.dumps(report, indent=2, sort_keys=True) if a.json else report)
    return 0 if report["ok"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
