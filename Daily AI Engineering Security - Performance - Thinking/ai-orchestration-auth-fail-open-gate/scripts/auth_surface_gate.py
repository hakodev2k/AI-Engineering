#!/usr/bin/env python3
"""Fail-closed admission checker for AI orchestration authentication surfaces."""
from __future__ import annotations

import json
import sys
from pathlib import Path

AUTH_MODES = {"required", "none", "optional", "upstream"}
ROUTE_MATCHES = {"exact", "prefix", "none"}


def load_config(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"file not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON: {exc}") from exc
    except OSError as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(data, dict) or not isinstance(data.get("surfaces"), list):
        raise ValueError("top-level object must contain surfaces: []")
    return data


def inspect_surface(item: object, index: int) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    findings: list[str] = []
    if not isinstance(item, dict):
        return [f"surfaces[{index}] must be an object"], findings

    name = item.get("name")
    auth = item.get("auth_mode")
    route_match = item.get("route_match", "none")
    critical = item.get("critical")
    directly_reachable = item.get("directly_reachable")
    exposed = item.get("exposed")

    if not isinstance(name, str) or not name.strip():
        errors.append(f"surfaces[{index}].name must be a non-empty string")
        name = f"surface-{index}"
    if auth not in AUTH_MODES:
        errors.append(f"{name}: auth_mode must be one of {sorted(AUTH_MODES)}")
    if route_match not in ROUTE_MATCHES:
        errors.append(f"{name}: route_match must be one of {sorted(ROUTE_MATCHES)}")
    for key, value in (("critical", critical), ("directly_reachable", directly_reachable), ("exposed", exposed)):
        if not isinstance(value, bool):
            errors.append(f"{name}: {key} must be boolean")

    if errors:
        return errors, findings

    if critical and exposed and auth in {"none", "optional"}:
        findings.append(f"{name}: critical exposed surface does not require authentication")
    if critical and directly_reachable and auth == "upstream":
        findings.append(f"{name}: critical backend relies on upstream auth but is directly reachable")
    if critical and route_match == "prefix" and item.get("anonymous_exemption", False):
        findings.append(f"{name}: critical route is covered by prefix-based anonymous exemption")
    if exposed and auth == "none" and item.get("fail_open", False):
        findings.append(f"{name}: exposed authentication path is explicitly fail-open")
    return errors, findings


def evaluate(data: dict) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    findings: list[str] = []
    for i, surface in enumerate(data["surfaces"]):
        e, f = inspect_surface(surface, i)
        errors.extend(e)
        findings.extend(f)
    return errors, findings


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print(f"usage: {argv[0]} <surfaces.json>", file=sys.stderr)
        return 1
    try:
        data = load_config(Path(argv[1]))
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    errors, findings = evaluate(data)
    if errors:
        print("INVALID")
        for error in errors:
            print(f"- {error}")
        return 1
    if findings:
        print("BLOCK")
        for finding in findings:
            print(f"- {finding}")
        return 2
    print(f"PASS: {len(data['surfaces'])} surface(s) satisfy declared auth admission policy")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
