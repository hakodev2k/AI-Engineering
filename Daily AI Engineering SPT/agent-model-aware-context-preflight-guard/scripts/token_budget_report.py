#!/usr/bin/env python3
"""Append and summarize estimate-vs-measured token budget telemetry."""
from __future__ import annotations

import argparse
import hashlib
import json
import pathlib
import statistics
import sys
from datetime import datetime, timezone


def sha256_file(path: str) -> str:
    return hashlib.sha256(pathlib.Path(path).read_bytes()).hexdigest()


def append_record(args: argparse.Namespace) -> int:
    if args.estimated < 0 or args.measured <= 0:
        raise ValueError("estimated must be >= 0 and measured must be > 0")
    record = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "request_sha256": sha256_file(args.request),
        "model": args.model,
        "estimated_tokens": args.estimated,
        "measured_tokens": args.measured,
        "error_tokens": args.estimated - args.measured,
        "error_ratio": round((args.estimated - args.measured) / args.measured, 8),
        "under_count": args.estimated < args.measured,
    }
    log = pathlib.Path(args.log)
    log.parent.mkdir(parents=True, exist_ok=True)
    with log.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(record, ensure_ascii=False, sort_keys=True) + "\n")
    print(json.dumps(record, ensure_ascii=False, sort_keys=True))
    return 0


def summarize(args: argparse.Namespace) -> int:
    path = pathlib.Path(args.log)
    if not path.exists():
        raise ValueError(f"log not found: {path}")
    records = []
    for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            record = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"invalid JSONL line {number}: {exc}") from exc
        if args.model and record.get("model") != args.model:
            continue
        records.append(record)
    if not records:
        raise ValueError("no matching records")
    ratios = [float(r["error_ratio"]) for r in records]
    under = [r for r in records if r.get("under_count")]
    result = {
        "records": len(records),
        "under_count_records": len(under),
        "under_count_rate": round(len(under) / len(records), 6),
        "mean_error_ratio": round(statistics.mean(ratios), 6),
        "min_error_ratio": round(min(ratios), 6),
        "max_error_ratio": round(max(ratios), 6),
        "model_filter": args.model,
    }
    print(json.dumps(result, sort_keys=True))
    return 1 if under else 0


def parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Token budget calibration telemetry")
    sub = p.add_subparsers(dest="command", required=True)
    a = sub.add_parser("append")
    a.add_argument("--log", required=True)
    a.add_argument("--request", required=True)
    a.add_argument("--model", required=True)
    a.add_argument("--estimated", required=True, type=int)
    a.add_argument("--measured", required=True, type=int)
    s = sub.add_parser("summarize")
    s.add_argument("--log", required=True)
    s.add_argument("--model")
    return p


def main() -> int:
    args = parser().parse_args()
    try:
        return append_record(args) if args.command == "append" else summarize(args)
    except (OSError, ValueError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
