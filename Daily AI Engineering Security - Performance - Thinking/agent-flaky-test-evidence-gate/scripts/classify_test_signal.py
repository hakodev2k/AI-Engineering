#!/usr/bin/env python3
"""Classify repeated test/build observations without hiding mixed outcomes.

Exit codes:
  0: classification produced
  2: invalid input/policy
  3: I/O or internal failure
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from collections import Counter
from pathlib import Path
from typing import Any

TIMESTAMP_RE = re.compile(r"\b\d{4}-\d{2}-\d{2}[T ][0-9:.+\-Z]+\b")
DURATION_RE = re.compile(r"\b\d+(?:\.\d+)?\s?(?:ms|s|sec|seconds|m|min|minutes)\b", re.I)
PID_RE = re.compile(r"\b(?:pid|process)\s*[=: ]\s*\d+\b", re.I)
PORT_RE = re.compile(r"(?<=:)\d{2,5}\b")
TMP_RE = re.compile(r"(?:/tmp/|/var/folders/|\\Temp\\|\\tmp\\)[^\s'\"]+", re.I)
ANSI_RE = re.compile(r"\x1b\[[0-9;]*[A-Za-z]")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Classify repeated command evidence.")
    p.add_argument("--input", required=True, help="JSONL from run_repeated_command.py")
    p.add_argument("--policy", required=True, help="Policy JSON")
    p.add_argument("--json-output", help="Optional file for classification JSON")
    return p.parse_args()


def normalize(text: str) -> str:
    text = ANSI_RE.sub("", text)
    text = TIMESTAMP_RE.sub("<timestamp>", text)
    text = TMP_RE.sub("<temp-path>", text)
    text = PID_RE.sub("pid=<pid>", text)
    text = PORT_RE.sub("<port>", text)
    text = DURATION_RE.sub("<duration>", text)
    lines = [line.rstrip() for line in text.splitlines() if line.strip()]
    # Bound pathological logs while preserving beginning/end failure context.
    if len(lines) > 240:
        lines = lines[:120] + ["<...bounded...>"] + lines[-120:]
    return "\n".join(lines)


def fingerprint(record: dict[str, Any]) -> str | None:
    if record.get("timed_out"):
        return "TIMEOUT"
    if record.get("exit_code") == 0:
        return None
    raw = (record.get("stderr") or "") + "\n" + (record.get("stdout") or "")
    norm = normalize(raw)
    if not norm:
        norm = f"exit_code={record.get('exit_code')}"
    return hashlib.sha256(norm.encode("utf-8", errors="replace")).hexdigest()[:16]


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as f:
        for n, line in enumerate(f, 1):
            if not line.strip():
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"invalid JSON on line {n}: {exc}") from exc
            if not isinstance(obj, dict):
                raise ValueError(f"line {n} is not a JSON object")
            rows.append(obj)
    if not rows:
        raise ValueError("input contains no run records")
    return rows


def classify(rows: list[dict[str, Any]], policy: dict[str, Any]) -> dict[str, Any]:
    passes = [r for r in rows if r.get("exit_code") == 0 and not r.get("timed_out")]
    failures = [r for r in rows if r not in passes]
    fps = [fp for fp in (fingerprint(r) for r in failures) if fp]
    counts = Counter(fps)

    markers = [str(x).lower() for x in policy.get("infrastructure_markers", [])]
    infra_hits: Counter[str] = Counter()
    for r in failures:
        text = ((r.get("stderr") or "") + "\n" + (r.get("stdout") or "")).lower()
        for marker in markers:
            if marker and marker in text:
                infra_hits[marker] += 1

    total = len(rows)
    pass_count = len(passes)
    fail_count = len(failures)
    dominant = counts.most_common(1)[0] if counts else (None, 0)

    if pass_count == total:
        classification = "CONSISTENT_PASS"
        reason = "all recorded observations passed"
    elif pass_count > 0 and fail_count > 0:
        classification = str(policy.get("mixed_outcome_classification", "FLAKY_OR_NONDETERMINISTIC"))
        reason = "same evidence set contains both passing and failing observations"
    elif fail_count == total and infra_hits and sum(infra_hits.values()) >= max(1, fail_count):
        classification = "LIKELY_INFRASTRUCTURE"
        reason = "all observations failed and infrastructure markers recur"
    elif fail_count == total and len(counts) == 1 and dominant[1] == fail_count:
        classification = "DETERMINISTIC_FAILURE"
        reason = "all observations failed with the same normalized fingerprint"
    elif fail_count == total and len(counts) > 1:
        classification = "FLAKY_OR_NONDETERMINISTIC"
        reason = "all observations failed but normalized failure fingerprints differ"
    else:
        classification = "UNKNOWN"
        reason = "evidence does not satisfy a supported classification rule"

    return {
        "schema_version": 1,
        "classification": classification,
        "reason": reason,
        "runs": total,
        "pass_count": pass_count,
        "fail_count": fail_count,
        "pass_rate": round(pass_count / total, 6),
        "fingerprints": dict(counts),
        "dominant_failure_fingerprint": dominant[0],
        "dominant_failure_count": dominant[1],
        "infrastructure_marker_hits": dict(infra_hits),
        "verified_from_raw_records": True,
    }


def main() -> int:
    try:
        args = parse_args()
        input_path = Path(args.input)
        policy_path = Path(args.policy)
        if not input_path.is_file() or not policy_path.is_file():
            print("input and policy must be existing files", file=sys.stderr)
            return 2
        rows = load_jsonl(input_path)
        policy = json.loads(policy_path.read_text(encoding="utf-8"))
        if not isinstance(policy, dict):
            print("policy must be a JSON object", file=sys.stderr)
            return 2
        result = classify(rows, policy)
        encoded = json.dumps(result, indent=2, ensure_ascii=False)
        print(encoded)
        if args.json_output:
            out = Path(args.json_output)
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(encoded + "\n", encoding="utf-8")
        return 0
    except (ValueError, json.JSONDecodeError) as exc:
        print(f"invalid input: {exc}", file=sys.stderr)
        return 2
    except Exception as exc:
        print(f"classification failure: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
