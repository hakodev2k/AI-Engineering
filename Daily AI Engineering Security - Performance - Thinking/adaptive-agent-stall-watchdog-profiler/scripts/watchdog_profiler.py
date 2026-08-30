#!/usr/bin/env python3
"""Profile agent watchdog behavior from JSONL traces.

Each record should contain:
  run_id: str
  phase: str
  duration_seconds: number
  outcome: one of success, timeout, error, cancelled
Optional:
  watchdog_seconds: number
  retry_count: int
  input_tokens: int
  output_tokens: int
  cache_read_tokens: int
  resumed_success: bool

Exit 0 when report is valid and policy budgets hold; 2 on invalid input/budget breach.
"""
from __future__ import annotations
import argparse
import json
import math
import statistics
import sys
from collections import defaultdict
from pathlib import Path


def load_json(path: Path):
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read config: {exc}") from exc
    if not isinstance(obj, dict):
        raise ValueError("config must be an object")
    return obj


def load_rows(path: Path):
    rows = []
    try:
        with path.open("r", encoding="utf-8") as fh:
            for n, line in enumerate(fh, 1):
                if not line.strip():
                    continue
                obj = json.loads(line)
                if not isinstance(obj, dict):
                    raise ValueError(f"line {n}: object required")
                rows.append(obj)
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSONL: {exc}") from exc
    return rows


def percentile(values, q):
    if not values:
        return None
    xs = sorted(float(v) for v in values)
    if len(xs) == 1:
        return xs[0]
    pos = (len(xs) - 1) * q
    lo, hi = math.floor(pos), math.ceil(pos)
    if lo == hi:
        return xs[lo]
    return xs[lo] + (xs[hi] - xs[lo]) * (pos - lo)


def analyze(rows, config):
    phases = defaultdict(list)
    violations = []
    false_abort_candidates = []
    total_tokens = 0
    base_tokens = 0
    retries = 0

    for i, r in enumerate(rows, 1):
        rid = str(r.get("run_id", f"row-{i}"))
        phase = str(r.get("phase", "unknown"))
        try:
            duration = float(r["duration_seconds"])
        except Exception as exc:
            raise ValueError(f"{rid}: duration_seconds required and numeric") from exc
        if duration < 0:
            raise ValueError(f"{rid}: duration_seconds must be >= 0")
        outcome = str(r.get("outcome", ""))
        if outcome not in {"success", "timeout", "error", "cancelled"}:
            raise ValueError(f"{rid}: invalid outcome")
        retry_count = int(r.get("retry_count", 0) or 0)
        if retry_count < 0:
            raise ValueError(f"{rid}: retry_count must be >= 0")
        retries += retry_count
        tokens = int(r.get("input_tokens", 0) or 0) + int(r.get("output_tokens", 0) or 0)
        if tokens < 0:
            raise ValueError(f"{rid}: token counts must be >= 0")
        total_tokens += tokens
        if retry_count == 0:
            base_tokens += tokens
        phases[phase].append((duration, outcome, r))

        watchdog = r.get("watchdog_seconds")
        if outcome == "timeout" and watchdog is not None:
            w = float(watchdog)
            if w > 0 and abs(duration - w) <= max(2.0, 0.01 * w):
                if bool(r.get("resumed_success", False)):
                    false_abort_candidates.append({"run_id": rid, "phase": phase, "duration_seconds": duration, "watchdog_seconds": w, "reason": "timeout_at_boundary_then_resume_succeeded"})

    phase_report = {}
    for phase, items in phases.items():
        success = [d for d, o, _ in items if o == "success"]
        timeouts = [d for d, o, _ in items if o == "timeout"]
        phase_report[phase] = {
            "count": len(items),
            "success_count": len(success),
            "timeout_count": len(timeouts),
            "success_p50_seconds": percentile(success, 0.50),
            "success_p95_seconds": percentile(success, 0.95),
            "success_p99_seconds": percentile(success, 0.99),
        }
        configured = config.get("phase_timeout_seconds", {}).get(phase, config.get("phase_timeout_seconds", {}).get("unknown"))
        if configured and success:
            p99 = phase_report[phase]["success_p99_seconds"]
            if p99 is not None and p99 >= float(configured):
                violations.append(f"{phase}:healthy_p99_meets_or_exceeds_timeout")

    max_retries = int(config.get("max_retries", 1))
    if retries > max_retries * max(1, len(rows)):
        violations.append("retry_budget_exceeded")

    token_multiplier = None
    if base_tokens > 0:
        token_multiplier = total_tokens / base_tokens
        if token_multiplier > float(config.get("max_retry_token_multiplier", 1.5)):
            violations.append("retry_token_multiplier_exceeded")

    return {
        "ok": not violations,
        "records": len(rows),
        "phases": phase_report,
        "false_abort_candidates": false_abort_candidates,
        "total_retries": retries,
        "total_tokens": total_tokens,
        "retry_token_multiplier": token_multiplier,
        "violations": violations,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("trace", type=Path)
    ap.add_argument("--config", type=Path, required=True)
    ap.add_argument("--json-out", type=Path)
    args = ap.parse_args()
    try:
        report = analyze(load_rows(args.trace), load_json(args.config))
    except (ValueError, OSError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    text = json.dumps(report, indent=2, sort_keys=True)
    if args.json_out:
        args.json_out.write_text(text + "\n", encoding="utf-8")
    print(text)
    return 0 if report["ok"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
