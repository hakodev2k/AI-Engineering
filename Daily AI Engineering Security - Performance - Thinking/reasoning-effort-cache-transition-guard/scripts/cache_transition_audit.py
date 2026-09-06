#!/usr/bin/env python3
"""Audit sequential agent request traces for cache-breaking reasoning-effort mutations."""
from __future__ import annotations
import argparse, json, statistics, sys
from collections import defaultdict
from pathlib import Path


def load_trace(path: Path):
    records = []
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read trace: {exc}") from exc
    for n, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            obj = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"line {n}: invalid JSON: {exc}") from exc
        if not isinstance(obj, dict):
            raise ValueError(f"line {n}: record must be object")
        for key in ("session_id", "seq", "request_reasoning_effort", "input_items"):
            if key not in obj:
                raise ValueError(f"line {n}: missing {key}")
        if not isinstance(obj["session_id"], str) or not obj["session_id"]:
            raise ValueError(f"line {n}: invalid session_id")
        if not isinstance(obj["seq"], int):
            raise ValueError(f"line {n}: seq must be integer")
        if not isinstance(obj["input_items"], list):
            raise ValueError(f"line {n}: input_items must be list")
        records.append(obj)
    if not records:
        raise ValueError("trace contains no records")
    return records


def config_updates(items):
    values = []
    for item in items:
        if not isinstance(item, dict):
            continue
        if item.get("type") == "configuration_update":
            effort = item.get("reasoning", {}).get("effort") if isinstance(item.get("reasoning"), dict) else item.get("reasoning_effort")
            values.append(effort)
    return values


def aggregate(records):
    def vals(key):
        return [float(r[key]) for r in records if isinstance(r.get(key), (int, float))]
    cached = vals("cached_input_tokens")
    total = vals("input_tokens")
    writes = vals("cache_write_tokens")
    latency = vals("latency_ms")
    quality = [1.0 if r.get("quality_pass") is True else 0.0 for r in records if isinstance(r.get("quality_pass"), bool)]
    cached_ratio = (sum(cached) / sum(total)) if cached and total and sum(total) > 0 else None
    return {
        "cached_input_ratio": cached_ratio,
        "cache_write_tokens": sum(writes) if writes else None,
        "input_tokens": sum(total) if total else None,
        "median_latency_ms": statistics.median(latency) if latency else None,
        "quality_pass_rate": (sum(quality) / len(quality)) if quality else None,
    }


def audit(records, compatible):
    grouped = defaultdict(list)
    for r in records:
        grouped[r["session_id"]].append(r)
    findings = []
    transitions = []
    for sid, recs in grouped.items():
        recs.sort(key=lambda r: r["seq"])
        previous = None
        seen_seq = set()
        for r in recs:
            if r["seq"] in seen_seq:
                findings.append({"severity": "fail", "session_id": sid, "seq": r["seq"], "reason": "duplicate-sequence"})
            seen_seq.add(r["seq"])
            req = r["request_reasoning_effort"]
            updates = config_updates(r["input_items"])
            if previous is None:
                previous = req
            elif req != previous:
                transitions.append({"session_id": sid, "seq": r["seq"], "from": previous, "to": req, "kind": "request-level"})
                findings.append({"severity": "fail" if compatible else "review", "session_id": sid, "seq": r["seq"], "reason": "request-level-effort-mutated", "from": previous, "to": req})
                previous = req
            for effort in updates:
                transitions.append({"session_id": sid, "seq": r["seq"], "to": effort, "kind": "configuration_update"})
                if effort is None:
                    findings.append({"severity": "review", "session_id": sid, "seq": r["seq"], "reason": "configuration-update-missing-effort"})
    metrics = aggregate(records)
    status = "pass"
    if any(f["severity"] == "fail" for f in findings): status = "fail"
    elif any(f["severity"] == "review" for f in findings): status = "review"
    if compatible and not any(t["kind"] == "configuration_update" for t in transitions) and len(records) > 1:
        # Not automatically a violation: the workload may never change effective effort.
        findings.append({"severity": "info", "reason": "no-configuration-update-observed"})
    return {"status": status, "compatible": compatible, "sessions": len(grouped), "records": len(records), "transitions": transitions, "findings": findings, "metrics": metrics}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--trace", required=True)
    ap.add_argument("--compatible", action="store_true", help="Declare that provider/application topology supports cache-preserving configuration_update transitions")
    args = ap.parse_args()
    try:
        result = audit(load_trace(Path(args.trace)), args.compatible)
        print(json.dumps(result, sort_keys=True))
        return {"pass": 0, "review": 10, "fail": 20}[result["status"]]
    except (ValueError, TypeError) as exc:
        print(json.dumps({"status": "error", "error": str(exc)}), file=sys.stderr)
        return 30

if __name__ == "__main__":
    raise SystemExit(main())
