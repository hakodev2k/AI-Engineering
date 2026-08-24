#!/usr/bin/env python3
"""Validate message authority provenance from JSONL without executing message content."""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

AUTHORITY_ROLES = {"user", "system"}
DEFAULT_TRUSTED_USER = {"interactive-ui", "authenticated-api", "verified-chat-gateway"}
DEFAULT_TRUSTED_SYSTEM = {"runtime-core", "policy-engine"}
SPOOF_MARKERS = ("<system-reminder", "[OUT-OF-BAND USER MESSAGE", "role=user", "role=system")


def parse_set(value: str, default: set[str]) -> set[str]:
    return {x.strip() for x in value.split(",") if x.strip()} if value else set(default)


def validate_event(event: dict, line_no: int, trusted_user: set[str], trusted_system: set[str]) -> list[dict]:
    findings: list[dict] = []
    role = str(event.get("role", "")).lower()
    source = str(event.get("source", ""))
    authenticated = event.get("authenticated") is True
    content = str(event.get("content", ""))
    authority = str(event.get("authority", role if role in AUTHORITY_ROLES else "data")).lower()

    if authority in AUTHORITY_ROLES or role in AUTHORITY_ROLES:
        expected = role if role in AUTHORITY_ROLES else authority
        trusted = trusted_user if expected == "user" else trusted_system
        if not source:
            findings.append({"line": line_no, "code": "MISSING_SOURCE", "severity": "block"})
        if not authenticated:
            findings.append({"line": line_no, "code": "UNAUTHENTICATED_AUTHORITY", "severity": "block", "source": source})
        if source not in trusted:
            findings.append({"line": line_no, "code": "UNTRUSTED_AUTHORITY_SOURCE", "severity": "block", "source": source, "authority": expected})

    if role not in AUTHORITY_ROLES and any(marker.lower() in content.lower() for marker in SPOOF_MARKERS):
        findings.append({"line": line_no, "code": "SPOOFED_AUTHORITY_MARKER", "severity": "warn", "source": source, "role": role})

    if role in {"assistant", "tool", "subagent"} and authority in AUTHORITY_ROLES:
        findings.append({"line": line_no, "code": "AUTHORITY_PROMOTION", "severity": "block", "source": source, "role": role, "authority": authority})
    return findings


def main() -> int:
    p = argparse.ArgumentParser(description="Fail closed on unauthenticated user/system authority events")
    p.add_argument("jsonl", type=Path)
    p.add_argument("--trusted-user-sources", default="")
    p.add_argument("--trusted-system-sources", default="")
    args = p.parse_args()
    if not args.jsonl.is_file():
        print(json.dumps({"error": f"input not found: {args.jsonl}"}), file=sys.stderr); return 2
    trusted_user = parse_set(args.trusted_user_sources, DEFAULT_TRUSTED_USER)
    trusted_system = parse_set(args.trusted_system_sources, DEFAULT_TRUSTED_SYSTEM)
    findings: list[dict] = []
    try:
        with args.jsonl.open("r", encoding="utf-8") as f:
            for line_no, raw in enumerate(f, 1):
                if not raw.strip(): continue
                event = json.loads(raw)
                if not isinstance(event, dict): raise ValueError(f"line {line_no}: object required")
                findings.extend(validate_event(event, line_no, trusted_user, trusted_system))
    except (json.JSONDecodeError, ValueError, OSError) as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr); return 2
    blocked = sum(1 for x in findings if x["severity"] == "block")
    print(json.dumps({"blocked": blocked, "finding_count": len(findings), "findings": findings}, indent=2))
    return 1 if blocked else 0

if __name__ == "__main__":
    raise SystemExit(main())
