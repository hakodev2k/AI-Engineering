#!/usr/bin/env python3
"""Verify report integrity and rescan the released artifact before transmission."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any


VALID_DISPOSITIONS = {"allow", "redact", "approval-required", "deny"}


def fail(message: str, code: int = 2) -> None:
    print(f"error: {message}", file=sys.stderr)
    raise SystemExit(code)


def load_json(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        fail(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        fail(f"invalid JSON in {path}: {exc}")
    if not isinstance(data, dict):
        fail(f"expected JSON object in {path}")
    return data


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def validate_report(report: dict[str, Any]) -> None:
    required = {
        "version",
        "generated_at",
        "input_sha256",
        "destination",
        "trust_level",
        "policy_version",
        "release_decision",
        "findings",
        "summary",
    }
    missing = sorted(required.difference(report))
    if missing:
        fail(f"report missing required fields: {', '.join(missing)}")
    if report.get("release_decision") not in VALID_DISPOSITIONS:
        fail("report contains invalid release_decision")
    findings = report.get("findings")
    if not isinstance(findings, list):
        fail("report findings must be an array")
    for index, item in enumerate(findings):
        if not isinstance(item, dict):
            fail(f"finding {index} must be an object")
        for field in ("id", "category", "severity", "disposition", "detector", "start", "end", "line", "value_sha256"):
            if field not in item:
                fail(f"finding {index} missing field: {field}")
        if item.get("disposition") not in VALID_DISPOSITIONS:
            fail(f"finding {index} has invalid disposition")
        if not isinstance(item.get("start"), int) or not isinstance(item.get("end"), int):
            fail(f"finding {index} offsets must be integers")


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify sanitization evidence and rescan the release artifact.")
    parser.add_argument("--report", required=True)
    parser.add_argument("--released", required=True)
    parser.add_argument("--policy", help="Optional policy path; otherwise uses AGENT_SENSITIVITY_POLICY/package default")
    args = parser.parse_args()

    report_path = Path(args.report).resolve()
    released_path = Path(args.released).resolve()
    if not released_path.exists():
        fail(f"released artifact not found: {released_path}")

    report = load_json(report_path)
    validate_report(report)

    if report.get("release_decision") == "deny":
        fail("original report contains a deny decision; create a new minimized candidate and rescan before release", 20)

    destination = report.get("destination")
    if not isinstance(destination, str) or not destination:
        fail("report destination must be a non-empty string")

    script_dir = Path(__file__).resolve().parent
    scanner = script_dir / "scan-sensitive-context.py"
    if not scanner.exists():
        fail(f"scanner script not found: {scanner}")

    policy_arg = args.policy or os.getenv("AGENT_SENSITIVITY_POLICY")

    with tempfile.TemporaryDirectory(prefix="agent-context-verify-") as temp_dir:
        rescan_report = Path(temp_dir) / "rescan.json"
        command = [
            sys.executable,
            str(scanner),
            "--input",
            str(released_path),
            "--destination",
            destination,
            "--output",
            str(rescan_report),
        ]
        if policy_arg:
            command.extend(["--policy", policy_arg])

        completed = subprocess.run(command, capture_output=True, text=True)
        if completed.returncode != 0:
            fail(f"release rescan failed: {completed.stderr.strip() or completed.stdout.strip()}")

        rescanned = load_json(rescan_report)
        validate_report(rescanned)

    blocking = [
        item
        for item in rescanned.get("findings", [])
        if isinstance(item, dict) and item.get("disposition") != "allow"
    ]
    if blocking:
        categories = sorted({str(item.get("category")) for item in blocking})
        fail(f"released artifact still contains non-allow sensitive findings: {', '.join(categories)}", 10)

    if rescanned.get("release_decision") != "allow":
        fail(f"released artifact did not rescan as allow: {rescanned.get('release_decision')}", 10)

    raw = released_path.read_bytes()
    print(
        "verified=true "
        f"release_sha256={sha256_bytes(raw)} "
        f"destination={destination} "
        f"remaining_allow_findings={len(rescanned.get('findings', []))}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
