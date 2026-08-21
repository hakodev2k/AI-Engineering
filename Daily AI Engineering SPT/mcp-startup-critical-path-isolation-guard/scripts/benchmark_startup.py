#!/usr/bin/env python3
"""Repeat a startup command and collect MCP startup timing events.

The child process may emit lines in this form:
    MCP_STARTUP_EVENT {"event":"core_ready","elapsed_ms":123.4}

Recognized events are stored without interpreting application-specific fields.
If no core_ready event is emitted, wall-clock process duration is retained but the
run is marked invalid for readiness regression decisions.
"""

from __future__ import annotations

import argparse
import json
import platform
import shlex
import statistics
import subprocess
import sys
import time
from pathlib import Path
from typing import Any

PREFIX = "MCP_STARTUP_EVENT "


def percentile(values: list[float], q: float) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    if len(ordered) == 1:
        return ordered[0]
    pos = (len(ordered) - 1) * q
    lo = int(pos)
    hi = min(lo + 1, len(ordered) - 1)
    frac = pos - lo
    return ordered[lo] * (1 - frac) + ordered[hi] * frac


def parse_event(line: str) -> dict[str, Any] | None:
    if not line.startswith(PREFIX):
        return None
    raw = line[len(PREFIX):].strip()
    try:
        value = json.loads(raw)
    except json.JSONDecodeError:
        return {"event": "parse_error", "raw": raw[:500]}
    if not isinstance(value, dict) or not isinstance(value.get("event"), str):
        return {"event": "parse_error", "raw": raw[:500]}
    return value


def run_once(command: str, timeout_s: float, run_index: int) -> dict[str, Any]:
    started = time.monotonic()
    proc = subprocess.Popen(
        command,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    events: list[dict[str, Any]] = []
    timed_out = False
    try:
        stdout, stderr = proc.communicate(timeout=timeout_s)
    except subprocess.TimeoutExpired:
        timed_out = True
        proc.kill()
        stdout, stderr = proc.communicate()
    wall_ms = (time.monotonic() - started) * 1000.0

    for line in stdout.splitlines() + stderr.splitlines():
        evt = parse_event(line)
        if evt is not None:
            events.append(evt)

    event_map: dict[str, list[dict[str, Any]]] = {}
    for evt in events:
        event_map.setdefault(str(evt.get("event")), []).append(evt)

    def first_elapsed(name: str) -> float | None:
        for evt in event_map.get(name, []):
            value = evt.get("elapsed_ms")
            if isinstance(value, (int, float)) and value >= 0:
                return float(value)
        return None

    return {
        "run": run_index,
        "exit_code": proc.returncode,
        "timed_out": timed_out,
        "wall_ms": round(wall_ms, 3),
        "core_ready_ms": first_elapsed("core_ready"),
        "first_prompt_accepted_ms": first_elapsed("first_prompt_accepted"),
        "first_useful_turn_ms": first_elapsed("first_useful_turn"),
        "fully_ready_ms": first_elapsed("fully_ready"),
        "optional_block_count": sum(
            int(evt.get("count", 1)) for evt in event_map.get("optional_block", [])
            if isinstance(evt.get("count", 1), int)
        ),
        "peak_initializers": max(
            [int(evt.get("count", 0)) for evt in event_map.get("initializer_count", [])
             if isinstance(evt.get("count", 0), int)] or [0]
        ),
        "events": events,
        "stderr_tail": "\n".join(stderr.splitlines()[-20:]),
    }


def summarize(runs: list[dict[str, Any]]) -> dict[str, Any]:
    valid_core = [float(r["core_ready_ms"]) for r in runs if isinstance(r.get("core_ready_ms"), (int, float))]
    return {
        "run_count": len(runs),
        "valid_core_ready_count": len(valid_core),
        "core_ready_p50_ms": percentile(valid_core, 0.50),
        "core_ready_p95_ms": percentile(valid_core, 0.95),
        "core_ready_p99_ms": percentile(valid_core, 0.99),
        "core_ready_mean_ms": statistics.fmean(valid_core) if valid_core else None,
        "optional_block_count": sum(int(r.get("optional_block_count", 0)) for r in runs),
        "peak_initializers": max([int(r.get("peak_initializers", 0)) for r in runs] or [0]),
        "timeouts": sum(1 for r in runs if r.get("timed_out")),
        "nonzero_exits": sum(1 for r in runs if r.get("exit_code") != 0),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--command", required=True, help="Command used to start the instrumented application")
    parser.add_argument("--runs", type=int, default=7)
    parser.add_argument("--timeout-seconds", type=float, default=60.0)
    parser.add_argument("--mode", choices=["cold", "warm"], default="cold")
    parser.add_argument("--scenario", default="normal")
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    if args.runs < 3 or args.runs > 100:
        print("--runs must be between 3 and 100", file=sys.stderr)
        return 2
    if args.timeout_seconds <= 0 or args.timeout_seconds > 3600:
        print("invalid --timeout-seconds", file=sys.stderr)
        return 2

    runs = [run_once(args.command, args.timeout_seconds, i + 1) for i in range(args.runs)]
    result = {
        "schema_version": 1,
        "mode": args.mode,
        "scenario": args.scenario,
        "command": shlex.join(shlex.split(args.command)) if args.command.strip() else args.command,
        "environment": {
            "platform": platform.platform(),
            "python": platform.python_version(),
        },
        "summary": summarize(runs),
        "runs": runs,
    }
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(result, indent=2, sort_keys=True), encoding="utf-8")
    print(json.dumps(result["summary"], sort_keys=True))

    if result["summary"]["valid_core_ready_count"] != args.runs:
        print("Not all runs emitted a valid core_ready event", file=sys.stderr)
        return 3
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
