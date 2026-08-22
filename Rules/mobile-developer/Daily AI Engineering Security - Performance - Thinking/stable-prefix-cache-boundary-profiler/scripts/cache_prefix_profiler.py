#!/usr/bin/env python3
"""Profile prompt-component stability and prompt-cache usage from JSONL traces.

Each non-empty JSONL line must be an object with:
  request_id: optional string
  prefix_parts: ordered list of {"name": str, "content": any}
Optional numeric fields:
  input_tokens, cached_tokens, cache_write_tokens, latency_ms, cost
Optional boolean field:
  quality_pass

The script never sends data anywhere. It hashes canonical JSON representations locally.
Exit codes: 0 success, 2 invalid input/config, 3 strict policy failure.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import statistics
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any


def canonical(value: Any) -> str:
    if isinstance(value, str):
        return value
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def digest(value: Any) -> str:
    return hashlib.sha256(canonical(value).encode("utf-8")).hexdigest()


def load_json(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data


def load_traces(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read trace file {path}: {exc}") from exc

    for line_no, raw in enumerate(lines, 1):
        if not raw.strip():
            continue
        try:
            row = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise ValueError(f"line {line_no}: invalid JSON: {exc}") from exc
        if not isinstance(row, dict):
            raise ValueError(f"line {line_no}: row must be an object")
        parts = row.get("prefix_parts")
        if not isinstance(parts, list) or not parts:
            raise ValueError(f"line {line_no}: prefix_parts must be a non-empty list")
        for index, part in enumerate(parts):
            if not isinstance(part, dict) or not isinstance(part.get("name"), str) or "content" not in part:
                raise ValueError(
                    f"line {line_no}: prefix_parts[{index}] must contain string name and content"
                )
        for field in ("input_tokens", "cached_tokens", "cache_write_tokens", "latency_ms", "cost"):
            if field in row and (not isinstance(row[field], (int, float)) or isinstance(row[field], bool) or row[field] < 0):
                raise ValueError(f"line {line_no}: {field} must be a non-negative number")
        if "quality_pass" in row and not isinstance(row["quality_pass"], bool):
            raise ValueError(f"line {line_no}: quality_pass must be boolean")
        rows.append(row)

    if not rows:
        raise ValueError("trace file contains no samples")
    return rows


def safe_ratio(numerator: float, denominator: float) -> float | None:
    return None if denominator <= 0 else numerator / denominator


def percentile(values: list[float], p: float) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    if len(ordered) == 1:
        return ordered[0]
    pos = (len(ordered) - 1) * p
    lo = int(pos)
    hi = min(lo + 1, len(ordered) - 1)
    fraction = pos - lo
    return ordered[lo] * (1 - fraction) + ordered[hi] * fraction


def analyze(rows: list[dict[str, Any]]) -> dict[str, Any]:
    sample_count = len(rows)
    names_by_position: dict[int, set[str]] = defaultdict(set)
    hashes_by_position: dict[int, set[str]] = defaultdict(set)
    seen_count: dict[int, int] = defaultdict(int)
    bytes_by_position: dict[int, list[int]] = defaultdict(list)

    for row in rows:
        for position, part in enumerate(row["prefix_parts"]):
            names_by_position[position].add(part["name"])
            hashes_by_position[position].add(digest(part["content"]))
            seen_count[position] += 1
            bytes_by_position[position].append(len(canonical(part["content"]).encode("utf-8")))

    max_parts = max(len(row["prefix_parts"]) for row in rows)
    components: list[dict[str, Any]] = []
    earliest_unstable: dict[str, Any] | None = None
    stable_prefix_positions = 0
    stable_prefix_bytes = 0.0

    for position in range(max_parts):
        names = names_by_position[position]
        unique_hashes = hashes_by_position[position]
        present = seen_count[position]
        fully_present = present == sample_count
        deterministic_name = len(names) == 1
        stable = fully_present and deterministic_name and len(unique_hashes) == 1
        stability_ratio = 0.0 if not fully_present else 1.0 / max(1, len(unique_hashes))
        average_bytes = statistics.fmean(bytes_by_position[position]) if bytes_by_position[position] else 0.0
        item = {
            "position": position,
            "names": sorted(names),
            "present_in_samples": present,
            "unique_content_hashes": len(unique_hashes),
            "stable": stable,
            "stability_ratio": round(stability_ratio, 6),
            "average_rendered_bytes": round(average_bytes, 2),
        }
        components.append(item)
        if earliest_unstable is None and not stable:
            earliest_unstable = item
        if earliest_unstable is None:
            stable_prefix_positions += 1
            stable_prefix_bytes += average_bytes

    total_input = sum(float(row.get("input_tokens", 0)) for row in rows)
    total_cached = sum(float(row.get("cached_tokens", 0)) for row in rows)
    total_writes = sum(float(row.get("cache_write_tokens", 0)) for row in rows)
    latency = [float(row["latency_ms"]) for row in rows if "latency_ms" in row]
    costs = [float(row["cost"]) for row in rows if "cost" in row]
    qualities = [row["quality_pass"] for row in rows if "quality_pass" in row]

    return {
        "sample_count": sample_count,
        "stable_prefix_component_count": stable_prefix_positions,
        "estimated_stable_prefix_bytes": round(stable_prefix_bytes, 2),
        "earliest_unstable_component": earliest_unstable,
        "components": components,
        "usage": {
            "input_tokens": total_input if total_input else None,
            "cached_tokens": total_cached if any("cached_tokens" in r for r in rows) else None,
            "cache_write_tokens": total_writes if any("cache_write_tokens" in r for r in rows) else None,
            "cached_ratio": safe_ratio(total_cached, total_input) if any("cached_tokens" in r for r in rows) else None,
            "cache_write_ratio": safe_ratio(total_writes, total_input) if any("cache_write_tokens" in r for r in rows) else None,
            "mean_cost": round(statistics.fmean(costs), 8) if costs else None,
            "p50_latency_ms": round(percentile(latency, 0.50), 2) if latency else None,
            "p95_latency_ms": round(percentile(latency, 0.95), 2) if latency else None,
            "quality_pass_rate": safe_ratio(sum(1 for q in qualities if q), len(qualities)) if qualities else None,
        },
    }


def evaluate(report: dict[str, Any], policy: dict[str, Any]) -> list[str]:
    failures: list[str] = []
    minimum_samples = int(policy.get("minimum_samples", 3))
    if report["sample_count"] < minimum_samples:
        failures.append(f"sample_count {report['sample_count']} < minimum_samples {minimum_samples}")

    usage = report["usage"]
    cached_ratio = usage.get("cached_ratio")
    if cached_ratio is not None and cached_ratio < float(policy.get("minimum_cached_ratio", 0.0)):
        failures.append(
            f"cached_ratio {cached_ratio:.4f} < minimum_cached_ratio {float(policy.get('minimum_cached_ratio', 0.0)):.4f}"
        )
    write_ratio = usage.get("cache_write_ratio")
    if write_ratio is not None and write_ratio > float(policy.get("maximum_cache_write_ratio", 1.0)):
        failures.append(
            f"cache_write_ratio {write_ratio:.4f} > maximum_cache_write_ratio {float(policy.get('maximum_cache_write_ratio', 1.0)):.4f}"
        )
    if policy.get("require_quality_pass", False):
        rate = usage.get("quality_pass_rate")
        if rate is None:
            failures.append("quality_pass is required but absent from all samples")
        elif rate < 1.0:
            failures.append(f"quality_pass_rate {rate:.4f} < 1.0000")
    return failures


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("trace", type=Path, help="JSONL trace file")
    parser.add_argument("--policy", type=Path, help="policy JSON")
    parser.add_argument("--strict", action="store_true", help="return exit 3 on policy violations")
    parser.add_argument("--output", type=Path, help="write report JSON to this path")
    args = parser.parse_args()

    try:
        rows = load_traces(args.trace)
        report = analyze(rows)
        policy = load_json(args.policy) if args.policy else {}
        report["policy_failures"] = evaluate(report, policy) if args.policy else []
    except (ValueError, TypeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    rendered = json.dumps(report, indent=2, ensure_ascii=False)
    if args.output:
        try:
            args.output.write_text(rendered + "\n", encoding="utf-8")
        except OSError as exc:
            print(f"error: cannot write output: {exc}", file=sys.stderr)
            return 2
    print(rendered)
    if args.strict and report["policy_failures"]:
        return 3
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
