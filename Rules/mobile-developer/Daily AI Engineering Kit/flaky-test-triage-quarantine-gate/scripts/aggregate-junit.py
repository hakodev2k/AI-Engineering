#!/usr/bin/env python3
"""Aggregate multiple JUnit XML observations without discarding intermittent failures.

Usage:
  python aggregate-junit.py --input "artifacts/test-runs/*.xml" --output artifacts/flaky-summary.json

Exit codes:
  0 success
  2 invalid arguments / no matching files
  3 XML parse or IO error
"""

from __future__ import annotations

import argparse
import glob
import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET
from collections import defaultdict
from pathlib import Path


def normalize_signature(text: str) -> str:
    text = (text or "").strip()
    if not text:
        return "unspecified-failure"
    first = next((line.strip() for line in text.splitlines() if line.strip()), text)
    first = re.sub(r"\b[0-9a-fA-F]{8}-[0-9a-fA-F-]{27,}\b", "<uuid>", first)
    first = re.sub(r"0x[0-9a-fA-F]+", "<hex>", first)
    first = re.sub(r"\b\d{4,}\b", "<n>", first)
    first = re.sub(r":line\s+\d+", ":line <n>", first, flags=re.IGNORECASE)
    first = re.sub(r"\s+", " ", first)
    return first[:500]


def signature_id(signature: str) -> str:
    return hashlib.sha256(signature.encode("utf-8")).hexdigest()[:12]


def iter_cases(root: ET.Element):
    if root.tag.endswith("testcase"):
        yield root
    for node in root.iter():
        if node is not root and node.tag.endswith("testcase"):
            yield node


def child_by_suffix(case: ET.Element, suffix: str):
    for child in list(case):
        if child.tag.endswith(suffix):
            return child
    return None


def parse_case(case: ET.Element) -> dict:
    classname = case.attrib.get("classname", "")
    name = case.attrib.get("name", "<unnamed>")
    test_id = f"{classname}::{name}" if classname else name

    failure = child_by_suffix(case, "failure")
    error = child_by_suffix(case, "error")
    skipped = child_by_suffix(case, "skipped")

    if failure is not None:
        status = "failed"
        raw = "\n".join(filter(None, [failure.attrib.get("message", ""), failure.text or ""]))
    elif error is not None:
        status = "error"
        raw = "\n".join(filter(None, [error.attrib.get("message", ""), error.text or ""]))
    elif skipped is not None:
        status = "skipped"
        raw = skipped.attrib.get("message", "") or (skipped.text or "")
    else:
        status = "passed"
        raw = ""

    signature = normalize_signature(raw) if status in {"failed", "error"} else None
    return {
        "test_id": test_id,
        "status": status,
        "time_seconds": float(case.attrib.get("time", "0") or 0),
        "signature": signature,
        "signature_id": signature_id(signature) if signature else None,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Glob for JUnit XML files")
    parser.add_argument("--output", required=True, help="Output JSON path")
    args = parser.parse_args()

    files = sorted(glob.glob(args.input))
    if not files:
        print(f"No files matched: {args.input}", file=sys.stderr)
        return 2

    observations = defaultdict(list)
    source_runs = []

    try:
        for run_index, filename in enumerate(files, start=1):
            tree = ET.parse(filename)
            root = tree.getroot()
            run_cases = []
            for case in iter_cases(root):
                parsed = parse_case(case)
                parsed["run_index"] = run_index
                parsed["source_file"] = filename
                observations[parsed["test_id"]].append(parsed)
                run_cases.append(parsed["test_id"])
            source_runs.append({
                "run_index": run_index,
                "source_file": filename,
                "testcase_count": len(run_cases),
            })
    except (OSError, ET.ParseError, ValueError) as exc:
        print(f"Failed to parse JUnit data: {exc}", file=sys.stderr)
        return 3

    tests = []
    for test_id in sorted(observations):
        rows = observations[test_id]
        counts = {status: sum(1 for r in rows if r["status"] == status) for status in ["passed", "failed", "error", "skipped"]}
        executable = counts["passed"] + counts["failed"] + counts["error"]
        failing = counts["failed"] + counts["error"]
        signatures = {}
        for row in rows:
            if row["signature_id"]:
                signatures.setdefault(row["signature_id"], {
                    "signature_id": row["signature_id"],
                    "signature": row["signature"],
                    "count": 0,
                })["count"] += 1

        tests.append({
            "test_id": test_id,
            "observations": len(rows),
            "executable_observations": executable,
            "counts": counts,
            "failure_rate": round(failing / executable, 4) if executable else None,
            "intermittent": counts["passed"] > 0 and failing > 0,
            "distinct_failure_signatures": len(signatures),
            "signatures": sorted(signatures.values(), key=lambda x: (-x["count"], x["signature_id"])),
            "runs": rows,
        })

    result = {
        "source_run_count": len(source_runs),
        "source_runs": source_runs,
        "test_count": len(tests),
        "intermittent_test_count": sum(1 for t in tests if t["intermittent"]),
        "tests": tests,
    }

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    try:
        output.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    except OSError as exc:
        print(f"Failed to write output: {exc}", file=sys.stderr)
        return 3

    print(f"Aggregated {len(files)} JUnit files into {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
