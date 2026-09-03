#!/usr/bin/env python3
import argparse
import json
import math
import sys
from pathlib import Path


def percentile(values, p):
    if not values:
        return 0.0
    xs = sorted(values)
    k = (len(xs) - 1) * p
    lo = math.floor(k)
    hi = math.ceil(k)
    if lo == hi:
        return float(xs[lo])
    return xs[lo] * (hi - k) + xs[hi] * (k - lo)


def load_jsonl(path):
    rows = []
    with open(path, encoding="utf-8") as handle:
        for line_no, line in enumerate(handle, 1):
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"{path}:{line_no}: invalid JSON: {exc}") from exc
            if not isinstance(obj, dict):
                raise ValueError(f"{path}:{line_no}: expected object")
            rows.append(obj)
    return rows


def main():
    parser = argparse.ArgumentParser(description="Analyze thread hydration working-set telemetry.")
    parser.add_argument("--telemetry", required=True, help="JSONL telemetry file")
    parser.add_argument("--policy", required=True, help="Policy JSON file")
    parser.add_argument("--json", action="store_true", help="Print full JSON report")
    args = parser.parse_args()

    try:
        rows = load_jsonl(args.telemetry)
        policy = json.loads(Path(args.policy).read_text(encoding="utf-8"))
        max_rss = float(policy["max_rss_mb"])
        max_resume = float(policy["max_resume_ms"])
        max_loaded = int(policy["max_loaded_items_per_thread"])
        max_parallel = int(policy["max_parallel_hydrations"])
    except (OSError, ValueError, KeyError, json.JSONDecodeError) as exc:
        print(f"input_error: {exc}", file=sys.stderr)
        return 2

    samples = []
    active = 0
    peak_parallel = 0
    for row in rows:
        if row.get("event") == "resume_start":
            active += 1
            peak_parallel = max(peak_parallel, active)
        elif row.get("event") == "resume_end":
            active = max(0, active - 1)
            required = ("thread_id", "resume_ms", "rss_mb", "loaded_items")
            if not all(key in row for key in required):
                print(f"input_error: resume_end missing fields: {row}", file=sys.stderr)
                return 2
            samples.append(row)

    if not samples:
        print("input_error: no resume_end samples", file=sys.stderr)
        return 2

    violations = []
    for sample in samples:
        checks = (
            ("resume_ms", float(sample["resume_ms"]), max_resume),
            ("rss_mb", float(sample["rss_mb"]), max_rss),
            ("loaded_items", int(sample["loaded_items"]), max_loaded),
        )
        for metric, value, limit in checks:
            if value > limit:
                violations.append({"thread_id": sample["thread_id"], "metric": metric, "value": value, "limit": limit})

    if peak_parallel > max_parallel:
        violations.append({"thread_id": "*", "metric": "peak_parallel_hydrations", "value": peak_parallel, "limit": max_parallel})

    report = {
        "samples": len(samples),
        "p95_resume_ms": round(percentile([float(s["resume_ms"]) for s in samples], 0.95), 2),
        "peak_rss_mb": max(float(s["rss_mb"]) for s in samples),
        "peak_loaded_items": max(int(s["loaded_items"]) for s in samples),
        "peak_parallel_hydrations": peak_parallel,
        "violations": violations,
        "status": "pass" if not violations else "fail",
    }

    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print(f"{report['status']}: {len(violations)} violation(s); p95_resume_ms={report['p95_resume_ms']}; peak_rss_mb={report['peak_rss_mb']}; peak_parallel={peak_parallel}")
    return 0 if not violations else 1


if __name__ == "__main__":
    raise SystemExit(main())
