#!/usr/bin/env python3
"""Validate a durable subagent handoff envelope before accepting completion."""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path


def load(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read valid JSON from {path}: {exc}") from exc


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    try:
        with path.open("rb") as fh:
            for chunk in iter(lambda: fh.read(1024 * 1024), b""):
                h.update(chunk)
    except OSError as exc:
        raise ValueError(f"cannot read artifact {path}: {exc}") from exc
    return h.hexdigest()


def validate(envelope: dict, policy: dict, base_dir: Path) -> dict:
    reasons = []
    task_id = envelope.get("task_id")
    if not isinstance(task_id, str) or not task_id.strip():
        reasons.append("missing task_id")

    terminal_state = str(envelope.get("terminal_state", "")).lower()
    terminal_reason = str(envelope.get("terminal_reason", "")).lower()
    accepted = {str(x).lower() for x in policy.get("accepted_terminal_states", ["completed", "success"])}
    blocked = {str(x).lower() for x in policy.get("blocked_terminal_reasons", [])}

    if terminal_state not in accepted:
        reasons.append(f"terminal_state '{terminal_state}' is not accepted")
    if terminal_reason and terminal_reason in blocked:
        reasons.append(f"terminal_reason '{terminal_reason}' indicates unfinished work")
    if envelope.get("unfinished_tool_calls"):
        reasons.append("unfinished_tool_calls is non-empty")

    deliverable = envelope.get("deliverable")
    if not isinstance(deliverable, dict):
        reasons.append("missing deliverable object")
        deliverable = {}
    kind = deliverable.get("kind")
    digest_verified = None
    if kind == "inline":
        content = deliverable.get("content")
        if not isinstance(content, str) or len(content.strip()) < int(policy.get("min_inline_deliverable_chars", 1)):
            reasons.append("inline deliverable is missing or below minimum length")
    elif kind == "artifact":
        rel = deliverable.get("path")
        if not isinstance(rel, str) or not rel.strip():
            reasons.append("artifact deliverable requires path")
        else:
            artifact = (base_dir / rel).resolve()
            try:
                artifact.relative_to(base_dir.resolve())
            except ValueError:
                reasons.append("artifact path escapes base directory")
            else:
                if not artifact.is_file():
                    reasons.append("artifact file does not exist")
                else:
                    actual = sha256_file(artifact)
                    expected = str(deliverable.get("sha256", "")).lower()
                    if policy.get("require_sha256_for_artifact", True) and not expected:
                        reasons.append("artifact sha256 is required")
                    elif expected:
                        digest_verified = actual == expected
                        if not digest_verified:
                            reasons.append("artifact sha256 mismatch")
    else:
        reasons.append("deliverable.kind must be 'inline' or 'artifact'")

    verification = envelope.get("verification_evidence")
    if policy.get("require_verification_evidence", True):
        if not isinstance(verification, list) or not any(isinstance(x, str) and x.strip() for x in verification):
            reasons.append("verification_evidence is required")

    checkpoints = envelope.get("checkpoints", [])
    recoverable_partial = isinstance(checkpoints, list) and len(checkpoints) > 0
    return {
        "status": "accept" if not reasons else "reject",
        "task_id": task_id,
        "terminal_state": terminal_state,
        "terminal_reason": terminal_reason or None,
        "digest_verified": digest_verified,
        "recoverable_partial_checkpoint": recoverable_partial,
        "blocking_reasons": reasons,
    }


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--envelope", required=True, type=Path)
    p.add_argument("--policy", required=True, type=Path)
    p.add_argument("--artifact-base", type=Path)
    p.add_argument("--output", type=Path)
    args = p.parse_args()
    try:
        envelope = load(args.envelope)
        policy = load(args.policy)
        base = (args.artifact_base or args.envelope.parent).resolve()
        report = validate(envelope, policy, base)
    except ValueError as exc:
        print(json.dumps({"status": "error", "error": str(exc)}), file=sys.stderr)
        return 3
    text = json.dumps(report, indent=2, sort_keys=True)
    if args.output:
        try:
            args.output.write_text(text + "\n", encoding="utf-8")
        except OSError as exc:
            print(json.dumps({"status": "error", "error": f"cannot write output: {exc}"}), file=sys.stderr)
            return 3
    print(text)
    return 0 if report["status"] == "accept" else 2


if __name__ == "__main__":
    raise SystemExit(main())
