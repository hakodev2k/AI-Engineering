#!/usr/bin/env python3
"""Profile post-tool continuation latency from normalized JSON/JSONL events.

Event schema (one object per line or JSON array):
{
  "run_id": "r1", "cycle_id": "c1", "tool": "exec_command",
  "phase": "tool_start|tool_end|result_ingested|next_model_start|next_agent_action",
  "ts": "2026-08-20T12:00:00.123+07:00"
}

Outputs JSON summary. Exit codes: 0 success, 2 incomplete/invalid cycles, 3 input error.
"""
from __future__ import annotations
import argparse, json, math, statistics, sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any

PHASES = ["tool_start", "tool_end", "result_ingested", "next_model_start", "next_agent_action"]


def parse_ts(value: str) -> datetime:
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except Exception as exc:
        raise ValueError(f"invalid timestamp {value!r}") from exc


def load_events(path: str) -> list[dict[str, Any]]:
    text = Path(path).read_text(encoding="utf-8").strip()
    if not text:
        return []
    if text.startswith("["):
        data = json.loads(text)
        if not isinstance(data, list):
            raise ValueError("JSON root must be an array")
        return data
    out = []
    for i, line in enumerate(text.splitlines(), 1):
        if line.strip():
            try:
                out.append(json.loads(line))
            except json.JSONDecodeError as exc:
                raise ValueError(f"invalid JSONL line {i}: {exc}") from exc
    return out


def pct(values: list[float], p: float) -> float | None:
    if not values:
        return None
    xs = sorted(values)
    if len(xs) == 1:
        return xs[0]
    k = (len(xs) - 1) * p
    f, c = math.floor(k), math.ceil(k)
    if f == c:
        return xs[f]
    return xs[f] * (c - k) + xs[c] * (k - f)


def summarize(values: list[float]) -> dict[str, float | int | None]:
    return {
        "count": len(values),
        "min_ms": round(min(values), 3) if values else None,
        "p50_ms": round(pct(values, .50), 3) if values else None,
        "p95_ms": round(pct(values, .95), 3) if values else None,
        "p99_ms": round(pct(values, .99), 3) if values else None,
        "max_ms": round(max(values), 3) if values else None,
        "mean_ms": round(statistics.fmean(values), 3) if values else None,
    }


def profile(events: list[dict[str, Any]]) -> tuple[dict[str, Any], list[str]]:
    grouped: dict[tuple[str, str], dict[str, Any]] = defaultdict(dict)
    errors: list[str] = []
    for idx, e in enumerate(events):
        try:
            run, cycle, tool, phase, ts = e["run_id"], e["cycle_id"], e.get("tool", "unknown"), e["phase"], e["ts"]
            if phase not in PHASES:
                raise ValueError(f"unknown phase {phase}")
            key = (str(run), str(cycle))
            if phase in grouped[key]:
                raise ValueError(f"duplicate phase {phase} for {key}")
            grouped[key][phase] = parse_ts(str(ts))
            grouped[key]["tool"] = str(tool)
        except Exception as exc:
            errors.append(f"event[{idx}]: {exc}")

    cycles = []
    metrics: dict[str, list[float]] = defaultdict(list)
    by_tool: dict[str, dict[str, list[float]]] = defaultdict(lambda: defaultdict(list))
    for (run, cycle), d in grouped.items():
        missing = [p for p in PHASES if p not in d]
        if missing:
            errors.append(f"{run}/{cycle}: missing phases {','.join(missing)}")
            continue
        times = [d[p] for p in PHASES]
        if any(times[i] > times[i+1] for i in range(len(times)-1)):
            errors.append(f"{run}/{cycle}: non-monotonic phase timestamps")
            continue
        def ms(a: str, b: str) -> float:
            return (d[b] - d[a]).total_seconds() * 1000.0
        row = {
            "run_id": run, "cycle_id": cycle, "tool": d["tool"],
            "tool_runtime_ms": ms("tool_start", "tool_end"),
            "result_ingestion_ms": ms("tool_end", "result_ingested"),
            "continuation_gap_ms": ms("tool_end", "next_model_start"),
            "model_continuation_ms": ms("next_model_start", "next_agent_action"),
            "tool_cycle_ms": ms("tool_start", "next_agent_action")
        }
        row["continuation_tool_ratio"] = (row["continuation_gap_ms"] / row["tool_runtime_ms"]) if row["tool_runtime_ms"] > 0 else None
        cycles.append(row)
        for k in ["tool_runtime_ms", "result_ingestion_ms", "continuation_gap_ms", "model_continuation_ms", "tool_cycle_ms"]:
            metrics[k].append(row[k])
            by_tool[d["tool"]][k].append(row[k])

    summary = {
        "complete_cycles": len(cycles),
        "incomplete_or_invalid": len(errors),
        "metrics": {k: summarize(v) for k, v in metrics.items()},
        "by_tool": {tool: {k: summarize(v) for k, v in m.items()} for tool, m in by_tool.items()},
        "cycles": cycles,
        "errors": errors
    }
    return summary, errors


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("--output")
    args = ap.parse_args()
    try:
        events = load_events(args.input)
        summary, errors = profile(events)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 3
    text = json.dumps(summary, indent=2)
    if args.output:
        Path(args.output).write_text(text + "\n", encoding="utf-8")
    else:
        print(text)
    return 2 if errors else 0

if __name__ == "__main__":
    raise SystemExit(main())