#!/usr/bin/env python3
"""Analyze tool-batch result completeness and latency by concurrency."""
import json
import math
import sys
from collections import defaultdict
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}")


def load_traces(path):
    rows = []
    try:
        lines = Path(path).read_text(encoding="utf-8").splitlines()
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    for line_no, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"invalid JSONL line {line_no}: {exc}")
        required = {"batch_id", "concurrency", "expected", "received", "latency_ms"}
        if not isinstance(row, dict) or not required.issubset(row):
            raise ValueError(f"line {line_no}: missing required fields")
        if not isinstance(row["concurrency"], int) or row["concurrency"] < 1:
            raise ValueError(f"line {line_no}: concurrency must be positive integer")
        if not isinstance(row["latency_ms"], (int, float)) or row["latency_ms"] < 0:
            raise ValueError(f"line {line_no}: latency_ms must be non-negative")
        if not isinstance(row["expected"], list) or not isinstance(row["received"], list):
            raise ValueError(f"line {line_no}: expected/received must be arrays")
        if len(set(row["expected"])) != len(row["expected"]):
            raise ValueError(f"line {line_no}: duplicate expected IDs")
        rows.append(row)
    if not rows:
        raise ValueError("trace file contains no batches")
    return rows


def percentile(values, q):
    if not values:
        return math.nan
    values = sorted(values)
    idx = max(0, math.ceil(q * len(values)) - 1)
    return float(values[idx])


def summarize(rows):
    groups = defaultdict(list)
    for row in rows:
        groups[row["concurrency"]].append(row)
    out = {}
    for c, batch_rows in sorted(groups.items()):
        complete = 0
        missing = 0
        extra = 0
        for row in batch_rows:
            exp, rec = set(row["expected"]), set(row["received"])
            missing += len(exp - rec)
            extra += len(rec - exp)
            if exp == rec:
                complete += 1
        out[c] = {
            "batches": len(batch_rows),
            "completeness_rate": complete / len(batch_rows),
            "missing_results": missing,
            "unexpected_results": extra,
            "p95_latency_ms": percentile([r["latency_ms"] for r in batch_rows], 0.95),
        }
    return out


def main(argv):
    if len(argv) != 3:
        print(f"usage: {argv[0]} <slo.json> <traces.jsonl>", file=sys.stderr)
        return 1
    try:
        slo = load_json(argv[1])
        rows = load_traces(argv[2])
        min_complete = float(slo["min_completeness_rate"])
        max_p95 = float(slo["max_p95_latency_ms"])
        if not (0 < min_complete <= 1) or max_p95 <= 0:
            raise ValueError("invalid SLO values")
    except (KeyError, TypeError, ValueError, OSError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    summaries = summarize(rows)
    verified = []
    for c, m in summaries.items():
        passed = m["completeness_rate"] >= min_complete and m["p95_latency_ms"] <= max_p95 and m["unexpected_results"] == 0
        print(f"concurrency={c} batches={m['batches']} completeness={m['completeness_rate']:.4f} missing={m['missing_results']} unexpected={m['unexpected_results']} p95_ms={m['p95_latency_ms']:.1f} status={'PASS' if passed else 'FAIL'}")
        if passed:
            verified.append(c)
    if not verified:
        print("BLOCK: no tested concurrency level satisfies SLO")
        return 3
    print(f"MAX_VERIFIED_CONCURRENCY={max(verified)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
