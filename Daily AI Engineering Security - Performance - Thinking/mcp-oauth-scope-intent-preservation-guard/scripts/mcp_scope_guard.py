#!/usr/bin/env python3
"""Deterministically validate MCP OAuth scope intent without handling credentials."""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path
from typing import Iterable


def normalize(values: Iterable[str] | None) -> list[str]:
    out: set[str] = set()
    for value in values or []:
        if not isinstance(value, str):
            raise ValueError("scope values must be strings")
        for part in value.split():
            part = part.strip()
            if part:
                out.add(part)
    return sorted(out)


def analyze(doc: dict) -> dict:
    required = set(normalize(doc.get("required_scopes")))
    desired = set(normalize(doc.get("desired_scopes")))
    granted = set(normalize(doc.get("granted_scopes")))
    challenge = set(normalize(doc.get("challenge_scopes")))
    supported_raw = doc.get("supported_scopes")
    supported = None if supported_raw is None else set(normalize(supported_raw))
    require_refresh = bool(doc.get("require_refresh", False))

    requested = required | desired | challenge
    if granted:
        # Step-up must accumulate rather than discard prior grants.
        requested |= granted

    errors: list[str] = []
    warnings: list[str] = []
    if supported is not None:
        missing_supported = required - supported
        if missing_supported:
            errors.append("required scopes not advertised as supported: " + ", ".join(sorted(missing_supported)))
        unsupported_optional = (desired | challenge) - supported
        if unsupported_optional:
            warnings.append("optional/challenge scopes not advertised as supported: " + ", ".join(sorted(unsupported_optional)))
        effective = requested & supported
    else:
        effective = requested

    lost_required = required - effective
    if lost_required:
        errors.append("required scope loss: " + ", ".join(sorted(lost_required)))

    if require_refresh and "offline_access" not in effective:
        errors.append("refresh survivability requested but offline_access is absent from effective scopes")
    if require_refresh and supported is not None and "offline_access" not in supported:
        warnings.append("authorization server does not advertise offline_access; refresh token issuance cannot be assumed")

    provenance: dict[str, list[str]] = {}
    for scope in sorted(required | desired | granted | challenge):
        sources = []
        if scope in required: sources.append("required")
        if scope in desired: sources.append("desired")
        if scope in granted: sources.append("granted")
        if scope in challenge: sources.append("challenge")
        provenance[scope] = sources

    return {
        "ok": not errors,
        "effective_scopes": sorted(effective),
        "required_scopes": sorted(required),
        "provenance": provenance,
        "errors": errors,
        "warnings": warnings,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate MCP OAuth scope intent and merge semantics")
    parser.add_argument("input", type=Path, help="JSON input document")
    parser.add_argument("--pretty", action="store_true")
    args = parser.parse_args()
    try:
        doc = json.loads(args.input.read_text(encoding="utf-8"))
        if not isinstance(doc, dict):
            raise ValueError("input JSON must be an object")
        result = analyze(doc)
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(json.dumps({"ok": False, "errors": [str(exc)]}), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2 if args.pretty else None, sort_keys=True))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
