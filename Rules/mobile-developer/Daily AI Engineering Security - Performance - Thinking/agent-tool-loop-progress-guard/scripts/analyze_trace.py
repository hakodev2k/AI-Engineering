#!/usr/bin/env python3
"""Analyze JSONL tool traces for duplicate and no-progress patterns."""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from collections import Counter
from typing import Any


def read_policy(path: str) -> dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, dict):
        raise ValueError("policy root must be object")
    return data


def digest(value: Any) -> str:
    raw = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()
    return hashlib.sha256(raw).hexdigest()


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("trace")
    p.add_argument("--policy", required=True)
    args = p.parse_args()
    try:
        read_policy(args.policy)
        events = []
        with open(args.trace, "r", encoding="utf-8") as f:
            for line_no, line in enumerate(f, 1):
                if not line.strip():
                    continue
                value = json.loads(line)
                if not isinstance(value, dict):
                    raise ValueError(f"line {line_no}: expected object")
                events.append(value)
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 2

    exact = Counter()
    families = Counter()
    outputs_by_family: dict[str, list[str]] = {}
    total_elapsed = 0.0
    for e in events:
        ef = str(e.get("exact_fingerprint") or "")
        ff = str(e.get("family_fingerprint") or "")
        if ef:
            exact[ef] += 1
        if ff:
            families[ff] += 1
        out = e.get("output_digest")
        if ff and out:
            outputs_by_family.setdefault(ff, []).append(str(out))
        elapsed = e.get("elapsed_ms")
        if isinstance(elapsed, (int, float)):
            total_elapsed += float(elapsed)

    repeated_exact = sum(max(0, n - 1) for n in exact.values())
    repeated_family = sum(max(0, n - 1) for n in families.values())
    no_novelty_pairs = 0
    for seq in outputs_by_family.values():
        for a, b in zip(seq, seq[1:]):
            if a == b:
                no_novelty_pairs += 1

    total = len(events)
    report = {
        "total_calls": total,
        "unique_exact_calls": len(exact),
        "unique_strategy_families": len(families),
        "repeated_exact_calls": repeated_exact,
        "repeated_family_calls": repeated_family,
        "same_output_consecutive_pairs": no_novelty_pairs,
        "repeat_exact_ratio": round(repeated_exact / total, 6) if total else 0,
        "repeat_family_ratio": round(repeated_family / total, 6) if total else 0,
        "tool_elapsed_ms": round(total_elapsed, 3),
        "top_exact_repeats": exact.most_common(10),
        "top_family_repeats": families.most_common(10)
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
