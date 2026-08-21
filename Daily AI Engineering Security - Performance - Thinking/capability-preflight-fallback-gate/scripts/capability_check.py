#!/usr/bin/env python3
"""Deterministic capability preflight and fallback-equivalence checker.

The input describes observable evidence only. This script never invokes external tools.
It is intended for CI, fixtures, and as a reference contract for runtime integrations.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


def load_json(path: str) -> Any:
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc


def string_set(value: Any, name: str) -> set[str]:
    if value is None:
        return set()
    if not isinstance(value, list) or not all(isinstance(x, str) and x for x in value):
        raise ValueError(f"{name} must be an array of non-empty strings")
    return set(value)


def evaluate_capability(cap: dict[str, Any]) -> dict[str, Any]:
    name = cap.get("name")
    if not isinstance(name, str) or not name:
        raise ValueError("capability.name must be a non-empty string")
    hard = bool(cap.get("hard", True))
    declared = bool(cap.get("declared", False))
    discoverable = bool(cap.get("discoverable", False))
    callable_ = bool(cap.get("callable", False))
    healthy = bool(cap.get("healthy", False))
    required = string_set(cap.get("required_semantics"), f"{name}.required_semantics")
    provided = string_set(cap.get("provided_semantics"), f"{name}.provided_semantics")

    missing_semantics = sorted(required - provided)
    if discoverable and callable_ and healthy and not missing_semantics:
        return {
            "name": name,
            "hard": hard,
            "status": "ready",
            "decision": "use",
            "missing_semantics": [],
        }

    if not discoverable:
        status = "missing"
    elif not callable_ or not healthy:
        status = "unhealthy"
    else:
        status = "insufficient_semantics"

    fallbacks = cap.get("fallbacks", [])
    if not isinstance(fallbacks, list):
        raise ValueError(f"{name}.fallbacks must be an array")
    for fallback in fallbacks:
        if not isinstance(fallback, dict):
            raise ValueError(f"{name}.fallback must be an object")
        fb_name = fallback.get("name")
        if not isinstance(fb_name, str) or not fb_name:
            raise ValueError(f"{name}.fallback.name must be a non-empty string")
        fb_semantics = string_set(fallback.get("provided_semantics"), f"{name}.{fb_name}.provided_semantics")
        fb_ready = bool(fallback.get("discoverable", False)) and bool(fallback.get("callable", False)) and bool(fallback.get("healthy", False))
        if fb_ready and required.issubset(fb_semantics):
            return {
                "name": name,
                "hard": hard,
                "status": status,
                "decision": "fallback",
                "fallback": fb_name,
                "missing_semantics": missing_semantics,
            }

    decision = "block" if hard else "degrade"
    return {
        "name": name,
        "hard": hard,
        "status": status,
        "decision": decision,
        "declared": declared,
        "missing_semantics": missing_semantics,
    }


def evaluate(doc: dict[str, Any]) -> dict[str, Any]:
    caps = doc.get("capabilities")
    if not isinstance(caps, list) or not caps:
        raise ValueError("input must contain a non-empty capabilities array")
    results = [evaluate_capability(c) for c in caps if isinstance(c, dict)]
    if len(results) != len(caps):
        raise ValueError("every capability must be an object")
    blocking = [r["name"] for r in results if r["decision"] == "block"]
    overall = "blocked" if blocking else "ready"
    if overall == "ready" and any(r["decision"] == "degrade" for r in results):
        overall = "degraded"
    return {"overall": overall, "blocking": blocking, "capabilities": results}


def verify(path: str) -> int:
    fixture = load_json(path)
    cases = fixture.get("cases") if isinstance(fixture, dict) else None
    if not isinstance(cases, list) or not cases:
        raise ValueError("fixture must contain a non-empty cases array")
    failures: list[str] = []
    for index, case in enumerate(cases, start=1):
        if not isinstance(case, dict):
            failures.append(f"case {index}: not an object")
            continue
        try:
            actual = evaluate(case.get("input", {}))
            expected = case.get("expected")
            if actual.get("overall") != expected:
                failures.append(f"case {index} {case.get('name','')}: expected {expected}, got {actual.get('overall')}")
            expected_decision = case.get("expected_decision")
            if expected_decision is not None:
                decisions = [r["decision"] for r in actual["capabilities"]]
                if expected_decision not in decisions:
                    failures.append(f"case {index} {case.get('name','')}: decision {expected_decision} not in {decisions}")
        except Exception as exc:
            failures.append(f"case {index} {case.get('name','')}: {exc}")
    if failures:
        for failure in failures:
            print(failure, file=sys.stderr)
        return 1
    print(f"verified {len(cases)} capability cases")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="cmd", required=True)
    p_eval = sub.add_parser("evaluate")
    p_eval.add_argument("--input", required=True)
    p_ver = sub.add_parser("verify")
    p_ver.add_argument("fixture")
    args = parser.parse_args()
    try:
        if args.cmd == "evaluate":
            doc = load_json(args.input)
            if not isinstance(doc, dict):
                raise ValueError("input must be a JSON object")
            result = evaluate(doc)
            print(json.dumps(result, indent=2, sort_keys=True))
            return 0 if result["overall"] != "blocked" else 3
        return verify(args.fixture)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
