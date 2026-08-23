#!/usr/bin/env python3
"""Validate non-overlapping phase intervals and summarize agent latency."""
from __future__ import annotations
import argparse
import json
import sys
from collections import defaultdict
from typing import Dict, List, Any

def load(path: str) -> List[Dict[str, Any]]:
    rows = []
    with open(path, "r", encoding="utf-8") as f:
        for lineno, line in enumerate(f, 1):
            if not line.strip():
                continue
            obj = json.loads(line)
            for key in ("run_id", "phase", "start_ms", "end_ms"):
                if key not in obj:
                    raise ValueError(f"line {lineno}: missing {key}")
            if not isinstance(obj["start_ms"], (int, float)) or not isinstance(obj["end_ms"], (int, float)):
                raise ValueError(f"line {lineno}: timestamps must be numeric")
            if obj["end_ms"] < obj["start_ms"]:
                raise ValueError(f"line {lineno}: end_ms before start_ms")
            rows.append(obj)
    if not rows:
        raise ValueError("trace contains no intervals")
    return rows

def profile(rows: List[Dict[str, Any]]) -> Dict[str, Any]:
    by_run = defaultdict(list)
    for row in rows:
        by_run[str(row["run_id"])].append(row)
    result = {"runs": {}}
    for run_id, items in sorted(by_run.items()):
        items = sorted(items, key=lambda x: (x["start_ms"], x["end_ms"]))
        prev_end = None
        phase_ms = defaultdict(float)
        gap_ms = 0.0
        named = []
        for item in items:
            start = float(item["start_ms"]); end = float(item["end_ms"])
            if prev_end is not None:
                if start < prev_end:
                    raise ValueError(f"run {run_id}: overlapping intervals at {start} < {prev_end}")
                gap_ms += start - prev_end
            duration = end - start
            phase_ms[str(item["phase"])] += duration
            named.append({"phase": str(item["phase"]), "name": str(item.get("name", "")), "duration_ms": duration})
            prev_end = end
        wall = float(items[-1]["end_ms"]) - float(items[0]["start_ms"])
        accounted = sum(phase_ms.values())
        phases = {k: {"duration_ms": v, "share_pct": (v / wall * 100.0 if wall else 0.0)} for k, v in sorted(phase_ms.items())}
        result["runs"][run_id] = {
            "wall_ms": wall,
            "accounted_ms": accounted,
            "unattributed_gap_ms": gap_ms,
            "unattributed_gap_pct": (gap_ms / wall * 100.0 if wall else 0.0),
            "phases": phases,
            "slowest_intervals": sorted(named, key=lambda x: x["duration_ms"], reverse=True)[:10],
        }
    return result

def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("trace")
    p.add_argument("--json", action="store_true")
    args = p.parse_args()
    try:
        out = profile(load(args.trace))
        if args.json:
            print(json.dumps(out, sort_keys=True))
        else:
            for run, data in out["runs"].items():
                print(f"run={run} wall_ms={data['wall_ms']:.1f} gap_ms={data['unattributed_gap_ms']:.1f}")
                for phase, val in data["phases"].items():
                    print(f"  {phase}: {val['duration_ms']:.1f} ms ({val['share_pct']:.1f}%)")
        return 0
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

if __name__ == "__main__":
    raise SystemExit(main())
