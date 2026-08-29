#!/usr/bin/env python3
"""Deterministic pre-write security gate for persistent agent memory.

Input is a JSON object containing at least:
  text, source_id, source_type, trust_level, writer_id, acquired_at, memory_class
Optional: expires_at, requested_privilege

Exit codes: 0 allow, 2 quarantine, 3 block, 1 invalid/runtime error.
Standard library only.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

SECRET_PATTERNS = [
    re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    re.compile(r"\bgh[pousr]_[A-Za-z0-9_]{20,}\b"),
    re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    re.compile(r"(?i)\b(?:api[_ -]?key|secret|password|token)\s*[:=]\s*['\"]?[A-Za-z0-9_./+=-]{12,}"),
]
INSTRUCTION_PATTERNS = [
    re.compile(r"(?i)\bignore (?:all |any )?(?:previous|prior|system|developer) instructions?\b"),
    re.compile(r"(?i)\b(?:system|developer) message\b"),
    re.compile(r"(?i)\bdo not tell (?:the )?user\b"),
    re.compile(r"(?i)\b(?:execute|run) (?:this |the )?(?:command|script|tool)\b"),
    re.compile(r"(?i)\b(?:override|bypass|disable) (?:security|policy|approval|guardrail)"),
    re.compile(r"(?i)\bwhen (?:you are )?(?:recalled|retrieved|loaded),?\s*(?:you must|do|execute|run)\b"),
]


def load_json(path: str) -> dict[str, Any]:
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"{path}: expected JSON object")
    return data


def iso_datetime(value: str) -> datetime:
    v = value.replace("Z", "+00:00")
    dt = datetime.fromisoformat(v)
    if dt.tzinfo is None:
        raise ValueError("timestamp must include timezone")
    return dt.astimezone(timezone.utc)


def fingerprint(candidate: dict[str, Any]) -> str:
    material = {
        "text": candidate.get("text", ""),
        "source_id": candidate.get("source_id"),
        "source_type": candidate.get("source_type"),
        "trust_level": candidate.get("trust_level"),
        "writer_id": candidate.get("writer_id"),
        "acquired_at": candidate.get("acquired_at"),
        "memory_class": candidate.get("memory_class"),
    }
    raw = json.dumps(material, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def evaluate(candidate: dict[str, Any], policy: dict[str, Any]) -> dict[str, Any]:
    required = ["text", "source_id", "source_type", "trust_level", "writer_id", "acquired_at", "memory_class"]
    missing = [k for k in required if candidate.get(k) in (None, "")]
    findings: list[dict[str, str]] = []
    if missing:
        findings.append({"severity": "high", "code": "missing_provenance", "detail": ",".join(missing)})

    text = candidate.get("text", "")
    if not isinstance(text, str):
        raise ValueError("text must be a string")
    if len(text.encode("utf-8")) > int(policy.get("max_candidate_bytes", 65536)):
        findings.append({"severity": "high", "code": "candidate_too_large", "detail": "candidate exceeds configured byte limit"})

    allowed_trust = set(policy.get("allowed_trust_levels", ["trusted", "internal", "untrusted"]))
    trust = str(candidate.get("trust_level", "untrusted"))
    if trust not in allowed_trust:
        findings.append({"severity": "high", "code": "unknown_trust_level", "detail": trust})

    source_type = str(candidate.get("source_type", "unknown"))
    memory_class = str(candidate.get("memory_class", "data"))
    privileged = set(policy.get("privileged_memory_classes", []))
    quarantine_sources = set(policy.get("quarantine_source_types", []))
    trusted_sources = set(policy.get("trusted_source_types", []))

    if candidate.get("acquired_at"):
        try:
            acquired = iso_datetime(str(candidate["acquired_at"]))
            age_days = (datetime.now(timezone.utc) - acquired).total_seconds() / 86400
            if age_days > float(policy.get("max_memory_age_days", 90)):
                findings.append({"severity": "medium", "code": "stale_candidate", "detail": f"age_days={age_days:.1f}"})
        except ValueError as exc:
            findings.append({"severity": "high", "code": "invalid_acquired_at", "detail": str(exc)})

    if trust == "untrusted" and policy.get("require_expiry_for_untrusted", True) and not candidate.get("expires_at"):
        findings.append({"severity": "medium", "code": "untrusted_without_expiry", "detail": "expiry required"})

    secret_hits = sum(bool(p.search(text)) for p in SECRET_PATTERNS)
    if secret_hits and policy.get("block_secret_patterns", True):
        findings.append({"severity": "critical", "code": "secret_like_content", "detail": f"patterns={secret_hits}"})

    instruction_hits = sum(bool(p.search(text)) for p in INSTRUCTION_PATTERNS)
    if instruction_hits and policy.get("quarantine_instruction_language", True):
        findings.append({"severity": "high", "code": "instruction_like_content", "detail": f"patterns={instruction_hits}"})

    if memory_class in privileged and (trust != "trusted" or source_type not in trusted_sources):
        findings.append({"severity": "critical", "code": "privileged_trust_mismatch", "detail": f"class={memory_class}, trust={trust}, source={source_type}"})
    elif source_type in quarantine_sources and trust != "trusted":
        findings.append({"severity": "medium", "code": "external_source_requires_quarantine_review", "detail": source_type})

    severities = {f["severity"] for f in findings}
    if "critical" in severities:
        decision = "block"
    elif "high" in severities or "medium" in severities:
        decision = "quarantine"
    else:
        decision = "allow"

    return {
        "decision": decision,
        "fingerprint": fingerprint(candidate),
        "findings": findings,
        "provenance_complete": not bool(missing),
        "requires_human_approval": bool(memory_class in privileged and decision != "allow"),
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("candidate")
    ap.add_argument("--policy", required=True)
    ap.add_argument("--json-out")
    args = ap.parse_args()
    try:
        report = evaluate(load_json(args.candidate), load_json(args.policy))
        rendered = json.dumps(report, indent=2, ensure_ascii=False)
        if args.json_out:
            Path(args.json_out).write_text(rendered + "\n", encoding="utf-8")
        print(rendered)
        return {"allow": 0, "quarantine": 2, "block": 3}[report["decision"]]
    except (OSError, json.JSONDecodeError, ValueError, TypeError) as exc:
        print(f"memory-write-gate error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
