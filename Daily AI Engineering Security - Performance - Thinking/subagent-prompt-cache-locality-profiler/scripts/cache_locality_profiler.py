#!/usr/bin/env python3
"""Profile prompt-cache locality across parallel/subagent dispatch groups.

Input: JSONL records. Required fields per record:
request_id, agent, dispatch_group, input_tokens, cache_creation_tokens, cache_read_tokens.
Optional: model, tool_manifest_hash, latency_ms, quality_pass.

Exit codes: 0 thresholds pass, 2 invalid input/config, 3 threshold regression.
"""
from __future__ import annotations
import argparse
import json
import statistics
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

OK, INVALID, REGRESSION = 0, 2, 3
REQUIRED = ("request_id", "agent", "dispatch_group", "input_tokens", "cache_creation_tokens", "cache_read_tokens")


def load_json(path: Path) -> dict[str, Any]:
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(obj, dict):
        raise ValueError("threshold config must be an object")
    return obj


def load_records(path: Path, strict: bool) -> tuple[list[dict[str, Any]], int]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read input: {exc}") from exc
    rows: list[dict[str, Any]] = []
    seen: set[str] = set()
    duplicates = 0
    for n, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            r = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"line {n}: invalid JSON: {exc}") from exc
        if not isinstance(r, dict):
            raise ValueError(f"line {n}: record must be object")
        missing = [k for k in REQUIRED if k not in r]
        if missing:
            if strict:
                raise ValueError(f"line {n}: missing {','.join(missing)}")
            continue
        rid = r["request_id"]
        if not isinstance(rid, str) or not rid:
            raise ValueError(f"line {n}: request_id must be non-empty string")
        if rid in seen:
            duplicates += 1
            continue
        seen.add(rid)
        for key in ("input_tokens", "cache_creation_tokens", "cache_read_tokens"):
            if not isinstance(r[key], int) or r[key] < 0:
                raise ValueError(f"line {n}: {key} must be non-negative integer")
        if not isinstance(r["agent"], str) or not isinstance(r["dispatch_group"], str):
            raise ValueError(f"line {n}: agent/dispatch_group must be strings")
        if "latency_ms" in r and (not isinstance(r["latency_ms"], (int, float)) or r["latency_ms"] < 0):
            raise ValueError(f"line {n}: latency_ms invalid")
        if "quality_pass" in r and not isinstance(r["quality_pass"], bool):
            raise ValueError(f"line {n}: quality_pass must be boolean")
        rows.append(r)
    if not rows:
        raise ValueError("no usable records")
    return rows, duplicates


def metric(rows: list[dict[str, Any]]) -> dict[str, Any]:
    create = sum(r["cache_creation_tokens"] for r in rows)
    read = sum(r["cache_read_tokens"] for r in rows)
    uncached = sum(r["input_tokens"] for r in rows)
    denom = create + read + uncached
    per_sibling = [r["cache_creation_tokens"] for r in rows]
    min_positive = min((x for x in per_sibling if x > 0), default=0)
    amplification = (create / min_positive) if min_positive else (0.0 if create == 0 else float(len(rows)))
    latencies = [float(r["latency_ms"]) for r in rows if "latency_ms" in r]
    quality = [r["quality_pass"] for r in rows if "quality_pass" in r]
    manifests = sorted({r.get("tool_manifest_hash") for r in rows if r.get("tool_manifest_hash")})
    models = sorted({r.get("model") for r in rows if r.get("model")})
    return {
        "requests": len(rows),
        "agents": sorted({r["agent"] for r in rows}),
        "cache_creation_tokens": create,
        "cache_read_tokens": read,
        "uncached_input_tokens": uncached,
        "cache_write_share": (create / denom) if denom else 0.0,
        "sibling_write_amplification": amplification,
        "mean_creation_tokens_per_sibling": statistics.fmean(per_sibling) if per_sibling else 0.0,
        "max_creation_tokens_per_sibling": max(per_sibling, default=0),
        "mean_latency_ms": statistics.fmean(latencies) if latencies else None,
        "quality_pass_rate": (sum(1 for q in quality if q) / len(quality)) if quality else None,
        "tool_manifest_variants": manifests,
        "model_variants": models,
    }


def analyze(rows: list[dict[str, Any]], cfg: dict[str, Any]) -> dict[str, Any]:
    groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for r in rows:
        groups[r["dispatch_group"]].append(r)
    output: dict[str, Any] = {"groups": {}, "violations": []}
    min_size = int(cfg.get("min_group_size_for_amplification", 2))
    for gid, items in sorted(groups.items()):
        m = metric(items)
        output["groups"][gid] = m
        if m["cache_write_share"] > float(cfg.get("max_cache_write_share", 1.0)):
            output["violations"].append({"group": gid, "metric": "cache_write_share", "value": m["cache_write_share"]})
        if len(items) >= min_size and m["sibling_write_amplification"] > float(cfg.get("max_sibling_write_amplification", 999999)):
            output["violations"].append({"group": gid, "metric": "sibling_write_amplification", "value": m["sibling_write_amplification"]})
        if m["max_creation_tokens_per_sibling"] > int(cfg.get("max_creation_tokens_per_sibling", 2**63 - 1)):
            output["violations"].append({"group": gid, "metric": "max_creation_tokens_per_sibling", "value": m["max_creation_tokens_per_sibling"]})
    output["summary"] = metric(rows)
    output["status"] = "regression" if output["violations"] else "pass"
    return output


def compare(base: dict[str, Any], candidate: dict[str, Any], tolerance: float) -> dict[str, Any]:
    bq = base.get("summary", {}).get("quality_pass_rate")
    cq = candidate.get("summary", {}).get("quality_pass_rate")
    quality_regression = bq is not None and cq is not None and cq + tolerance < bq
    bc = base.get("summary", {}).get("cache_creation_tokens", 0)
    cc = candidate.get("summary", {}).get("cache_creation_tokens", 0)
    return {
        "cache_creation_delta": cc - bc,
        "cache_creation_change_ratio": ((cc - bc) / bc) if bc else None,
        "quality_regression": quality_regression,
        "baseline_quality_pass_rate": bq,
        "candidate_quality_pass_rate": cq,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("records", type=Path)
    ap.add_argument("--thresholds", type=Path, required=True)
    ap.add_argument("--baseline", type=Path, help="optional baseline JSONL for before/after comparison")
    args = ap.parse_args()
    try:
        cfg = load_json(args.thresholds)
        strict = bool(cfg.get("block_on_missing_usage_fields", True))
        rows, dup = load_records(args.records, strict)
        report = analyze(rows, cfg)
        report["deduplicated_request_records"] = dup
        if args.baseline:
            brows, bdup = load_records(args.baseline, strict)
            b = analyze(brows, cfg)
            report["baseline_deduplicated_request_records"] = bdup
            report["comparison"] = compare(b, report, float(cfg.get("quality_regression_tolerance", 0.0)))
            if report["comparison"]["quality_regression"]:
                report["violations"].append({"metric": "quality_regression", "value": True})
                report["status"] = "regression"
    except (ValueError, TypeError) as exc:
        print(json.dumps({"status": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(report, indent=2, sort_keys=True))
    return REGRESSION if report["violations"] else OK


if __name__ == "__main__":
    raise SystemExit(main())
