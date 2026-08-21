#!/usr/bin/env python3
"""Provider-neutral prompt-cache health analyzer.

Input is JSONL containing request and invalidator events. See README for schema.
Exit codes: 0 valid/pass, 2 invalid input/config, 3 policy gate failure, 4 insufficient data.
"""
from __future__ import annotations

import argparse
import json
import math
import statistics
import sys
from pathlib import Path
from typing import Any

REQUIRED_REQUEST = ["seq", "provider", "model", "input_tokens", "cache_read_tokens", "latency_ms"]


def load_json(path: str) -> Any:
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot load JSON {path}: {exc}") from exc


def load_events(path: str) -> list[dict[str, Any]]:
    events: list[dict[str, Any]] = []
    try:
        with Path(path).open("r", encoding="utf-8") as f:
            for lineno, raw in enumerate(f, 1):
                if not raw.strip():
                    continue
                try:
                    item = json.loads(raw)
                except json.JSONDecodeError as exc:
                    raise ValueError(f"line {lineno}: invalid JSON: {exc}") from exc
                if not isinstance(item, dict):
                    raise ValueError(f"line {lineno}: event must be an object")
                item["_line"] = lineno
                events.append(item)
    except OSError as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not events:
        raise ValueError("telemetry is empty")
    return events


def number(v: Any, name: str, line: int, allow_none: bool = False) -> float:
    if v is None and allow_none:
        return 0.0
    if isinstance(v, bool) or not isinstance(v, (int, float)) or not math.isfinite(float(v)) or v < 0:
        raise ValueError(f"line {line}: {name} must be a finite non-negative number")
    return float(v)


def validate(events: list[dict[str, Any]], policy: dict[str, Any]) -> list[dict[str, Any]]:
    fingerprints = policy.get("stable_fingerprint_fields", [])
    if not isinstance(fingerprints, list):
        raise ValueError("policy.stable_fingerprint_fields must be an array")
    seen_seq: set[int] = set()
    requests: list[dict[str, Any]] = []
    last_seq = -1
    for ev in events:
        line = int(ev.get("_line", 0))
        et = ev.get("type", "request")
        if et == "invalidator":
            if not isinstance(ev.get("kind"), str) or not ev["kind"]:
                raise ValueError(f"line {line}: invalidator requires kind")
            if "seq" in ev:
                number(ev["seq"], "seq", line)
            continue
        if et != "request":
            raise ValueError(f"line {line}: unsupported type {et!r}")
        for key in REQUIRED_REQUEST:
            if key not in ev:
                raise ValueError(f"line {line}: missing {key}")
        seq_f = number(ev["seq"], "seq", line)
        if not seq_f.is_integer():
            raise ValueError(f"line {line}: seq must be an integer")
        seq = int(seq_f)
        if seq in seen_seq or seq <= last_seq:
            raise ValueError(f"line {line}: request seq must be unique and strictly increasing")
        seen_seq.add(seq)
        last_seq = seq
        for key in ("input_tokens", "cache_read_tokens", "latency_ms"):
            number(ev[key], key, line)
        number(ev.get("cache_creation_tokens", 0), "cache_creation_tokens", line)
        if float(ev["cache_read_tokens"]) > float(ev["input_tokens"]):
            raise ValueError(f"line {line}: cache_read_tokens exceeds input_tokens")
        for key in fingerprints:
            if key not in ev:
                raise ValueError(f"line {line}: missing fingerprint field {key}")
        requests.append(ev)
    return requests


def percentile(values: list[float], q: float) -> float:
    if not values:
        return 0.0
    xs = sorted(values)
    if len(xs) == 1:
        return xs[0]
    pos = (len(xs) - 1) * q
    lo, hi = math.floor(pos), math.ceil(pos)
    if lo == hi:
        return xs[lo]
    return xs[lo] + (xs[hi] - xs[lo]) * (pos - lo)


def fingerprint(ev: dict[str, Any], fields: list[str]) -> tuple[Any, ...]:
    return tuple(ev.get(k) for k in fields)


def analyze(events: list[dict[str, Any]], policy: dict[str, Any]) -> dict[str, Any]:
    requests = validate(events, policy)
    min_tokens = int(policy.get("minimum_cache_eligible_input_tokens", 4096))
    min_requests = int(policy.get("minimum_requests_for_gate", 10))
    inv_window = int(policy.get("known_invalidator_window_requests", 2))
    known = set(policy.get("known_invalidators", []))
    fp_fields = list(policy.get("stable_fingerprint_fields", []))

    eligible = [r for r in requests if float(r["input_tokens"]) >= min_tokens]
    if len(eligible) < min_requests:
        return {
            "status": "insufficient_data",
            "request_count": len(requests),
            "eligible_request_count": len(eligible),
            "minimum_required": min_requests,
        }

    total_input = sum(float(r["input_tokens"]) for r in eligible)
    total_read = sum(float(r["cache_read_tokens"]) for r in eligible)
    total_create = sum(float(r.get("cache_creation_tokens", 0)) for r in eligible)
    total_uncached_increment = sum(max(0.0, float(r["input_tokens"]) - float(r["cache_read_tokens"]) - float(r.get("cache_creation_tokens", 0))) for r in eligible)
    read_ratio = total_read / total_input if total_input else 0.0
    creation_ratio = total_create / total_input if total_input else 0.0
    creation_amplification = total_create / max(1.0, total_uncached_increment)

    invalidators = []
    for ev in events:
        if ev.get("type") == "invalidator" and ev.get("kind") in known:
            invalidators.append((int(ev.get("seq", -1)), str(ev["kind"])))

    resets: list[dict[str, Any]] = []
    prev = None
    for cur in eligible:
        cur_ratio = float(cur["cache_read_tokens"]) / max(1.0, float(cur["input_tokens"]))
        if prev is not None:
            prev_ratio = float(prev["cache_read_tokens"]) / max(1.0, float(prev["input_tokens"]))
            # Strong transition heuristic: healthy/high reuse -> low reuse on another cache-eligible request.
            if prev_ratio >= 0.60 and cur_ratio <= 0.20:
                changed = [k for k in fp_fields if prev.get(k) != cur.get(k)]
                nearby = [kind for seq, kind in invalidators if 0 <= int(cur["seq"]) - seq <= inv_window]
                if nearby:
                    classification = "explained_known_invalidator"
                elif changed:
                    classification = "explained_fingerprint_change"
                else:
                    classification = "unexplained"
                resets.append({
                    "seq": int(cur["seq"]),
                    "previous_seq": int(prev["seq"]),
                    "previous_cache_read_ratio": round(prev_ratio, 6),
                    "current_cache_read_ratio": round(cur_ratio, 6),
                    "classification": classification,
                    "changed_fingerprint_fields": changed,
                    "nearby_known_invalidators": nearby,
                    "cache_creation_tokens": float(cur.get("cache_creation_tokens", 0)),
                })
        prev = cur

    unexplained = sum(1 for r in resets if r["classification"] == "unexplained")
    rate100 = unexplained * 100.0 / len(eligible)
    latencies = [float(r["latency_ms"]) for r in eligible]

    violations: list[str] = []
    if read_ratio < float(policy.get("minimum_expected_cache_read_ratio", 0.70)):
        violations.append("cache_read_ratio_below_minimum")
    if rate100 > float(policy.get("maximum_unexplained_resets_per_100_requests", 3)):
        violations.append("unexplained_reset_rate_above_maximum")
    if creation_amplification > float(policy.get("maximum_cache_creation_amplification", 2.0)):
        violations.append("cache_creation_amplification_above_maximum")

    return {
        "status": "fail" if violations else "pass",
        "request_count": len(requests),
        "eligible_request_count": len(eligible),
        "metrics": {
            "input_tokens": total_input,
            "cache_read_tokens": total_read,
            "cache_creation_tokens": total_create,
            "cache_read_ratio": round(read_ratio, 6),
            "cache_creation_ratio": round(creation_ratio, 6),
            "cache_creation_amplification": round(creation_amplification, 6),
            "unexplained_resets": unexplained,
            "unexplained_resets_per_100_requests": round(rate100, 6),
            "latency_p50_ms": round(statistics.median(latencies), 3),
            "latency_p95_ms": round(percentile(latencies, 0.95), 3),
        },
        "resets": resets,
        "violations": violations,
    }


def main() -> int:
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="command", required=True)
    for name in ("validate", "analyze"):
        sp = sub.add_parser(name)
        sp.add_argument("--input", required=True)
        sp.add_argument("--policy", required=True)
        if name == "analyze":
            sp.add_argument("--output")
    args = p.parse_args()
    try:
        policy = load_json(args.policy)
        if not isinstance(policy, dict):
            raise ValueError("policy must be a JSON object")
        events = load_events(args.input)
        if args.command == "validate":
            requests = validate(events, policy)
            print(json.dumps({"status": "valid", "request_count": len(requests)}, indent=2))
            return 0
        report = analyze(events, policy)
        text = json.dumps(report, indent=2, sort_keys=True)
        if args.output:
            Path(args.output).write_text(text + "\n", encoding="utf-8")
        print(text)
        if report["status"] == "insufficient_data":
            return 4
        return 0 if report["status"] == "pass" else 3
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
