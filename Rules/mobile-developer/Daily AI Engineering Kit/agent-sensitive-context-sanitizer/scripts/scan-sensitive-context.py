#!/usr/bin/env python3
"""Deterministically scan a text artifact for sensitive context.

No detected raw value is written to the JSON report. Findings contain only offsets,
classification metadata, and SHA-256 hashes of matched values.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import re
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


DECISION_PRECEDENCE = {
    "allow": 0,
    "redact": 1,
    "approval-required": 2,
    "deny": 3,
}


def fail(message: str, code: int = 2) -> None:
    print(f"error: {message}", file=sys.stderr)
    raise SystemExit(code)


def load_json(path: Path) -> dict[str, Any]:
    try:
        with path.open("r", encoding="utf-8") as handle:
            data = json.load(handle)
    except FileNotFoundError:
        fail(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        fail(f"invalid JSON in {path}: {exc}")
    if not isinstance(data, dict):
        fail(f"expected JSON object in {path}")
    return data


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def shannon_entropy(value: str) -> float:
    if not value:
        return 0.0
    counts = Counter(value)
    length = len(value)
    return -sum((count / length) * math.log2(count / length) for count in counts.values())


def regex_flags(names: list[str]) -> int:
    value = 0
    mapping = {
        "IGNORECASE": re.IGNORECASE,
        "MULTILINE": re.MULTILINE,
        "DOTALL": re.DOTALL,
    }
    for name in names:
        if name not in mapping:
            fail(f"unsupported regex flag in policy: {name}")
        value |= mapping[name]
    return value


def disposition_for(policy: dict[str, Any], category: str, trust: str) -> tuple[str, str]:
    categories = policy.get("categories")
    if not isinstance(categories, dict) or category not in categories:
        fail(f"category missing from policy: {category}")
    cfg = categories[category]
    if not isinstance(cfg, dict):
        fail(f"invalid category config: {category}")
    severity = cfg.get("severity")
    dispositions = cfg.get("disposition_by_trust")
    if not isinstance(severity, str) or not isinstance(dispositions, dict):
        fail(f"invalid category policy: {category}")
    disposition = dispositions.get(trust)
    if disposition not in DECISION_PRECEDENCE:
        fail(f"no valid disposition for category={category}, trust={trust}")
    return severity, disposition


def finding(
    *,
    finding_id: str,
    category: str,
    detector: str,
    start: int,
    end: int,
    value: str,
    text: str,
    severity: str,
    disposition: str,
) -> dict[str, Any]:
    return {
        "id": finding_id,
        "category": category,
        "severity": severity,
        "disposition": disposition,
        "detector": detector,
        "start": start,
        "end": end,
        "line": text.count("\n", 0, start) + 1,
        "value_sha256": sha256_bytes(value.encode("utf-8")),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Scan text context for sensitive data without logging matched values.")
    parser.add_argument("--input", required=True, help="UTF-8 text file to scan")
    parser.add_argument("--destination", required=True, help="Destination key used by the sensitivity policy")
    parser.add_argument("--output", required=True, help="JSON report output path")
    parser.add_argument("--policy", help="Policy JSON path; defaults to AGENT_SENSITIVITY_POLICY or package config")
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    default_policy = script_dir.parent / "config" / "sensitivity-policy.json"
    policy_path = Path(args.policy or os.getenv("AGENT_SENSITIVITY_POLICY", str(default_policy))).resolve()
    input_path = Path(args.input).resolve()
    output_path = Path(args.output).resolve()

    policy = load_json(policy_path)
    raw = input_path.read_bytes() if input_path.exists() else fail(f"file not found: {input_path}")
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        fail("input must be UTF-8 text")

    trust_map = policy.get("destination_trust", {})
    if not isinstance(trust_map, dict):
        fail("destination_trust must be an object")
    trust = trust_map.get(args.destination, policy.get("default_trust_level", "external"))
    if trust not in {"trusted", "internal", "external"}:
        fail(f"unsupported trust level: {trust}")

    findings: list[dict[str, Any]] = []
    counter = 1

    detectors = policy.get("detectors", [])
    if not isinstance(detectors, list):
        fail("detectors must be an array")

    for detector_cfg in detectors:
        if not isinstance(detector_cfg, dict):
            fail("detector entry must be an object")
        if detector_cfg.get("type") != "regex":
            fail(f"unsupported detector type: {detector_cfg.get('type')}")
        detector_id = detector_cfg.get("id")
        category = detector_cfg.get("category")
        pattern = detector_cfg.get("pattern")
        flags = detector_cfg.get("flags", [])
        if not all(isinstance(item, str) for item in [detector_id, category, pattern]):
            fail("regex detector requires string id, category, and pattern")
        if not isinstance(flags, list) or not all(isinstance(item, str) for item in flags):
            fail(f"flags must be an array of strings for detector {detector_id}")
        severity, disposition = disposition_for(policy, category, trust)
        try:
            compiled = re.compile(pattern, regex_flags(flags))
        except re.error as exc:
            fail(f"invalid regex for detector {detector_id}: {exc}")
        for match in compiled.finditer(text):
            findings.append(
                finding(
                    finding_id=f"F{counter:04d}",
                    category=category,
                    detector=detector_id,
                    start=match.start(),
                    end=match.end(),
                    value=match.group(0),
                    text=text,
                    severity=severity,
                    disposition=disposition,
                )
            )
            counter += 1

    entropy_cfg = policy.get("entropy_detector", {})
    if isinstance(entropy_cfg, dict) and entropy_cfg.get("enabled") is True:
        category = entropy_cfg.get("category")
        pattern = entropy_cfg.get("candidate_pattern")
        min_length = int(entropy_cfg.get("min_length", 28))
        max_length = int(entropy_cfg.get("max_length", 256))
        min_entropy = float(entropy_cfg.get("min_entropy", 4.2))
        if not isinstance(category, str) or not isinstance(pattern, str):
            fail("entropy detector requires category and candidate_pattern")
        severity, disposition = disposition_for(policy, category, trust)
        try:
            compiled_entropy = re.compile(pattern)
        except re.error as exc:
            fail(f"invalid entropy candidate regex: {exc}")
        existing_spans = [(item["start"], item["end"]) for item in findings]
        for match in compiled_entropy.finditer(text):
            value = match.group(0)
            if not (min_length <= len(value) <= max_length):
                continue
            if shannon_entropy(value) < min_entropy:
                continue
            if any(match.start() >= start and match.end() <= end for start, end in existing_spans):
                continue
            findings.append(
                finding(
                    finding_id=f"F{counter:04d}",
                    category=category,
                    detector="entropy-token",
                    start=match.start(),
                    end=match.end(),
                    value=value,
                    text=text,
                    severity=severity,
                    disposition=disposition,
                )
            )
            counter += 1

    findings.sort(key=lambda item: (item["start"], item["end"], item["detector"]))
    release_decision = "allow"
    for item in findings:
        if DECISION_PRECEDENCE[item["disposition"]] > DECISION_PRECEDENCE[release_decision]:
            release_decision = item["disposition"]

    counts: dict[str, int] = {}
    for item in findings:
        counts[item["category"]] = counts.get(item["category"], 0) + 1

    report = {
        "version": 1,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "input_path": str(input_path),
        "input_sha256": sha256_bytes(raw),
        "destination": args.destination,
        "trust_level": trust,
        "policy_version": policy.get("version", 1),
        "release_decision": release_decision,
        "findings": findings,
        "summary": {
            "total_findings": len(findings),
            "by_category": counts,
        },
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(f"decision={release_decision} findings={len(findings)} report={output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
