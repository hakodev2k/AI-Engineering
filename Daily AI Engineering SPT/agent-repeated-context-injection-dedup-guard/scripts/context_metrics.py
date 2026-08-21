#!/usr/bin/env python3
"""Compare baseline host-context tokens with guarded decisions.

Consumes the original JSONL event stream and decision JSONL produced by
context_injection_guard.py. Emits a compact JSON report.

Exit codes:
  0 metrics computed
  2 target reduction not reached or required event suppressed
  3 invalid input
  4 runtime error
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            obj = json.loads(line)
        except Exception as exc:
            raise ValueError(f"{path}:{n}: {exc}") from exc
        if not isinstance(obj, dict):
            raise ValueError(f"{path}:{n}: object expected")
        rows.append(obj)
    return rows


def estimate(text: str, chars_per_token: float) -> int:
    return 0 if not text else max(1, int(len(text) / chars_per_token + 0.999999))


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--events", required=True, type=Path)
    p.add_argument("--decisions", required=True, type=Path)
    p.add_argument("--chars-per-token", type=float, default=4.0)
    p.add_argument("--target-reduction", type=float, default=0.30)
    p.add_argument("--output", type=Path)
    a = p.parse_args()
    try:
        events = read_jsonl(a.events)
        decisions = read_jsonl(a.decisions)
        if len(events) != len(decisions):
            raise ValueError("events and decisions have different lengths")
        baseline = sum(estimate(str(e.get("content", "")), a.chars_per_token) for e in events)
        included = sum(int(d.get("estimated_tokens", 0)) for d in decisions if d.get("action") == "include")
        suppressed = sum(int(d.get("estimated_tokens", 0)) for d in decisions if d.get("action") == "suppress")
        rejected = sum(1 for d in decisions if d.get("action") == "reject")
        required_bad = [d for d in decisions if d.get("required") and d.get("action") != "include"]
        ratio = (baseline - included) / baseline if baseline else 0.0
        duplicates = sum(1 for d in decisions if d.get("reason") == "exact_duplicate_within_freshness_window")
        report = {
            "events": len(events),
            "baseline_estimated_tokens": baseline,
            "guarded_estimated_tokens": included,
            "suppressed_estimated_tokens": suppressed,
            "reduction_ratio": round(ratio, 6),
            "duplicate_events": duplicates,
            "duplicate_ratio": round(duplicates / len(events), 6) if events else 0.0,
            "rejected_events": rejected,
            "required_context_violations": len(required_bad),
            "target_reduction": a.target_reduction,
            "target_met": ratio >= a.target_reduction,
        }
        rendered = json.dumps(report, indent=2, sort_keys=True) + "\n"
        if a.output:
            a.output.write_text(rendered, encoding="utf-8")
        else:
            sys.stdout.write(rendered)
        return 0 if report["target_met"] and not required_bad else 2
    except ValueError as exc:
        print(f"input error: {exc}", file=sys.stderr)
        return 3
    except Exception as exc:
        print(f"runtime error: {exc}", file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
