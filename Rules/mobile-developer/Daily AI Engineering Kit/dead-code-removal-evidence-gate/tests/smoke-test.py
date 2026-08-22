#!/usr/bin/env python3
"""Smoke test for the deterministic dead-code evidence gate."""

from __future__ import annotations

import json
from pathlib import Path
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
VALIDATOR = ROOT / "scripts" / "validate-evidence.py"
POLICY = ROOT / "config" / "dead-code-policy.json"


def run(args: list[str], expect: int) -> None:
    completed = subprocess.run(args, text=True, capture_output=True)
    if completed.returncode != expect:
        print(completed.stdout)
        print(completed.stderr, file=sys.stderr)
        raise SystemExit(f"expected exit {expect}, got {completed.returncode}: {' '.join(args)}")


def base_record() -> dict:
    return {
        "candidate": {
            "identifier": "UnusedInternalHelper",
            "kind": "symbol",
            "path": "src/UnusedInternalHelper.cs",
            "visibility": "internal",
            "exposure": "internal"
        },
        "repository": {"root": ".", "revision": "deadbeef"},
        "status": "approved-for-removal",
        "verification_status": "partially-verified",
        "channels": {
            "static-references": {"status": "clear", "evidence": ["scan"]},
            "dynamic-discovery": {"status": "clear", "evidence": ["inspection"]},
            "configuration-registration": {"status": "clear", "evidence": ["inspection"]},
            "tests": {"status": "clear", "evidence": ["test review"]},
            "contract-exposure": {"status": "clear", "evidence": ["internal only"]}
        },
        "review": {"decision": "accepted", "reviewer": "reviewer", "independent": True, "notes": []},
        "approvals": [],
        "artifacts": {"pre_removal_scan": "before.json", "post_removal_scan": "", "build_test_evidence": []},
        "remaining_risks": []
    }


def main() -> int:
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        good = tmp_path / "good.json"
        good.write_text(json.dumps(base_record()), encoding="utf-8")
        run([sys.executable, str(VALIDATOR), str(good), "--policy", str(POLICY), "--require-removal-ready"], 0)

        blocked_record = base_record()
        blocked_record["channels"]["dynamic-discovery"] = {"status": "unknown", "evidence": []}
        blocked = tmp_path / "blocked.json"
        blocked.write_text(json.dumps(blocked_record), encoding="utf-8")
        run([sys.executable, str(VALIDATOR), str(blocked), "--policy", str(POLICY), "--require-removal-ready"], 1)

        verified_record = base_record()
        verified_record["status"] = "removed"
        verified_record["verification_status"] = "verified"
        verified_record["artifacts"]["post_removal_scan"] = "after.json"
        verified_record["artifacts"]["build_test_evidence"] = ["build pass", "tests pass"]
        verified = tmp_path / "verified.json"
        verified.write_text(json.dumps(verified_record), encoding="utf-8")
        run([sys.executable, str(VALIDATOR), str(verified), "--policy", str(POLICY), "--require-verified"], 0)

    print("smoke-test=pass")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
