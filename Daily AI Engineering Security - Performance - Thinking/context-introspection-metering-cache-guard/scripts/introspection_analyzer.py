#!/usr/bin/env python3
"""Analyze JSONL traces of auxiliary context/token introspection calls.

Required per record: turn, provider, model, fingerprint, input_tokens, latency_ms,
cache_hit. Optional: cost_usd, kind.

Exit codes: 0 valid report; 3 budget breach; 4 invalid input.
"""
from __future__ import annotations

import argparse
import json
import statistics
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

REQUIRED = {"turn", "provider", "model", "fingerprint", "input_tokens", "latency_ms", "cache_hit"}


def load_trace(path: Path) -> list[dict[str, Any]]:
    rows = []
    with path.open("r", encoding="utf-8") as f:
        for lineno, raw in enumerate(f, 1):
            if not raw.strip():
                continue
            try:
                row = json.loads(raw)
            except json.JSONDecodeError as exc:
                raise ValueError(f"line {lineno}: invalid JSON: {exc}") from exc
            if not isinstance(row, dict):
                raise ValueError(f"line {lineno}: record must be object")
            missing = REQUIRED - row.keys()
            if missing:
                raise ValueError(f"line {lineno}: missing {sorted(missing)}")
            for key in ("input_tokens", "latency_ms"):
                if not isinstance(row[key], (int, float)) or row[key] < 0:
                    raise ValueError(f"line {lineno}: {key} must be non-negative number")
            if not isinstance(row["cache_hit"], bool):
                raise ValueError(f"line {lineno}: cache_hit must be boolean")
            row["cost_usd"] = float(row.get("cost_usd", 0.0))
            if row["cost_usd"] < 0:
                raise ValueError(f"line {lineno}: cost_usd must be non-negative")
            rows.append(row)
    if not rows:
        raise ValueError("trace is empty")
    return rows


def summarize(rows: list[dict[str, Any]]) -> dict[str, Any]:
    if not rows:
        raise ValueError("rows are empty")
    requests = len(rows)
    tokens = sum(float(r["input_tokens"]) for r in rows)
    latency = sum(float(r["latency_ms"]) for r in rows)
    cost = sum(float(r.get("cost_usd", 0.0)) for r in rows)
    hits = sum(1 for r in rows if r["cache_hit"])
    turns = {str(r["turn"]) for r in rows}

    counts = Counter((str(r["provider"]), str(r["model"]), str(r["fingerprint"])) for r in rows)
    repeated = {"|".join(k): v for k, v in counts.items() if v > 1}
    repeated_calls = sum(v - 1 for v in counts.values() if v > 1)

    uncached_by_fp = defaultdict(int)
    for r in rows:
        if not r["cache_hit"]:
            key = (str(r["provider"]), str(r["model"]), str(r["fingerprint"]))
            uncached_by_fp[key] += 1
    repeated_uncached = {"|".join(k): v for k, v in uncached_by_fp.items() if v > 1}

    return {
        "requests": requests,
        "turns": len(turns),
        "requests_per_turn": requests / max(1, len(turns)),
        "input_tokens": tokens,
        "input_tokens_per_turn": tokens / max(1, len(turns)),
        "latency_ms": latency,
        "mean_latency_ms": statistics.mean(float(r["latency_ms"]) for r in rows),
        "cost_usd": cost,
        "cache_hits": hits,
        "cache_hit_rate": hits / requests,
        "unique_fingerprints": len(counts),
        "repeated_calls": repeated_calls,
        "repeated_fingerprints": repeated,
        "repeated_uncached_fingerprints": repeated_uncached,
    }


def compare(before: dict[str, Any], after: dict[str, Any]) -> dict[str, Any]:
    def pct(old: float, new: float) -> float | None:
        return None if old == 0 else (new - old) / old * 100.0
    return {
        "requests_change_percent": pct(float(before["requests"]), float(after["requests"])),
        "input_tokens_change_percent": pct(float(before["input_tokens"]), float(after["input_tokens"])),
        "latency_change_percent": pct(float(before["latency_ms"]), float(after["latency_ms"])),
        "cost_change_percent": pct(float(before["cost_usd"]), float(after["cost_usd"])),
        "cache_hit_rate_delta": float(after["cache_hit_rate"]) - float(before["cache_hit_rate"]),
    }


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("trace", type=Path)
    p.add_argument("--compare", type=Path)
    p.add_argument("--max-requests-per-turn", type=float)
    p.add_argument("--max-input-tokens-per-turn", type=float)
    args = p.parse_args()
    try:
        current = summarize(load_trace(args.trace))
        out: dict[str, Any] = {"trace": str(args.trace), "summary": current}
        if args.compare:
            baseline = summarize(load_trace(args.compare))
            out["baseline"] = baseline
            out["comparison"] = compare(baseline, current)
    except (OSError, ValueError) as exc:
        print(json.dumps({"error": str(exc)}, sort_keys=True))
        return 4

    breaches = []
    if args.max_requests_per_turn is not None and current["requests_per_turn"] > args.max_requests_per_turn:
        breaches.append("REQUESTS_PER_TURN")
    if args.max_input_tokens_per_turn is not None and current["input_tokens_per_turn"] > args.max_input_tokens_per_turn:
        breaches.append("INPUT_TOKENS_PER_TURN")
    out["budget_breaches"] = breaches
    print(json.dumps(out, indent=2, sort_keys=True))
    return 3 if breaches else 0


if __name__ == "__main__":
    sys.exit(main())
