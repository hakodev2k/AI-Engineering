#!/usr/bin/env python3
"""Audit a derived agent-history projection against an authoritative JSONL log."""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

EXIT_INVALID_STATE = 20
EXIT_DEGRADED = 21
EXIT_INPUT = 2
CRITICAL_TYPES = {"user", "assistant", "tool_call", "tool_result", "approval", "decision", "final", "task_complete"}
TERMINAL_TYPES = {"final", "task_complete"}
TERMINAL_STATES = {"complete", "completed", "idle"}
NONTERMINAL_STATES = {"running", "inprogress", "in_progress"}


def read_jsonl(path: str) -> list[dict]:
    records = []
    with open(path, "r", encoding="utf-8") as fh:
        for line_no, raw in enumerate(fh, 1):
            if not raw.strip():
                continue
            try:
                value = json.loads(raw)
            except json.JSONDecodeError as exc:
                raise ValueError(f"{path}:{line_no}: invalid JSON: {exc.msg}") from exc
            if not isinstance(value, dict):
                raise ValueError(f"{path}:{line_no}: expected object")
            if not isinstance(value.get("ordinal"), int):
                raise ValueError(f"{path}:{line_no}: ordinal must be integer")
            if not isinstance(value.get("type"), str) or not value["type"]:
                raise ValueError(f"{path}:{line_no}: type must be non-empty string")
            records.append(value)
    if not records:
        raise ValueError(f"{path}: no records")
    return records


def ordinal_findings(records: list[dict], label: str) -> list[dict]:
    findings = []
    ords = [r["ordinal"] for r in records]
    seen = set()
    for o in ords:
        if o in seen:
            findings.append({"code": f"{label}-duplicate-ordinal", "severity": "invalid", "ordinal": o})
        seen.add(o)
    for prev, cur in zip(ords, ords[1:]):
        if cur <= prev:
            findings.append({"code": f"{label}-out-of-order", "severity": "invalid", "ordinal": cur})
    return findings


def terminal_state(records: list[dict]) -> bool:
    return any(r.get("type", "").lower() in TERMINAL_TYPES for r in records)


def evaluate(durable: list[dict], projected: list[dict], runtime_state: str | None = None) -> dict:
    findings = ordinal_findings(durable, "durable") + ordinal_findings(projected, "projection")
    durable_by_ord = {r["ordinal"]: r for r in durable}
    projected_by_ord = {r["ordinal"]: r for r in projected}
    durable_ords = set(durable_by_ord)
    projected_ords = set(projected_by_ord)

    extra = sorted(projected_ords - durable_ords)
    if extra:
        findings.append({"code": "projection-extra-ordinals", "severity": "invalid", "ordinals": extra})

    missing = sorted(durable_ords - projected_ords)
    missing_critical = [o for o in missing if durable_by_ord[o].get("type", "").lower() in CRITICAL_TYPES]
    missing_noncritical = [o for o in missing if o not in missing_critical]
    if missing_critical:
        findings.append({"code": "missing-critical-ordinals", "severity": "invalid", "ordinals": missing_critical})
    if missing_noncritical:
        findings.append({"code": "missing-noncritical-ordinals", "severity": "degraded", "ordinals": missing_noncritical})

    for o in sorted(durable_ords & projected_ords):
        if durable_by_ord[o].get("type") != projected_by_ord[o].get("type"):
            findings.append({"code": "event-type-mismatch", "severity": "invalid", "ordinal": o})

    durable_terminal = terminal_state(durable)
    projected_terminal = terminal_state(projected)
    if durable_terminal and not projected_terminal:
        findings.append({"code": "terminal-evidence-missing-from-projection", "severity": "invalid"})

    projection_states = [str(r.get("state", "")).lower() for r in projected if r.get("state") is not None]
    if durable_terminal and any(s in NONTERMINAL_STATES or s == "interrupted" for s in projection_states[-1:]):
        findings.append({"code": "projected-terminal-state-contradiction", "severity": "invalid"})

    if runtime_state:
        rs = runtime_state.lower()
        if durable_terminal and rs in NONTERMINAL_STATES:
            findings.append({"code": "runtime-terminal-state-contradiction", "severity": "invalid"})
        if not durable_terminal and rs in TERMINAL_STATES and missing:
            findings.append({"code": "runtime-complete-with-missing-history", "severity": "invalid"})

    coverage = len(durable_ords & projected_ords) / len(durable_ords)
    status = "healthy"
    if any(f["severity"] == "invalid" for f in findings):
        status = "invalid"
    elif any(f["severity"] == "degraded" for f in findings):
        status = "degraded"
    return {
        "status": status,
        "projection_coverage_ratio": round(coverage, 6),
        "durable_records": len(durable),
        "projected_records": len(projected),
        "durable_min_ordinal": min(durable_ords),
        "durable_max_ordinal": max(durable_ords),
        "projected_min_ordinal": min(projected_ords),
        "projected_max_ordinal": max(projected_ords),
        "missing_ordinals": missing,
        "missing_critical_ordinals": missing_critical,
        "durable_terminal_evidence": durable_terminal,
        "projected_terminal_evidence": projected_terminal,
        "runtime_state": runtime_state,
        "findings": findings,
    }


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--durable", required=True)
    p.add_argument("--projected", required=True)
    p.add_argument("--runtime-state")
    p.add_argument("--output")
    args = p.parse_args()
    try:
        result = evaluate(read_jsonl(args.durable), read_jsonl(args.projected), args.runtime_state)
    except (OSError, ValueError) as exc:
        print(json.dumps({"status": "invalid", "error": str(exc)}), file=sys.stderr)
        return EXIT_INPUT
    text = json.dumps(result, indent=2, sort_keys=True)
    if args.output:
        Path(args.output).write_text(text + "\n", encoding="utf-8")
    else:
        print(text)
    if result["status"] == "healthy":
        return 0
    return EXIT_DEGRADED if result["status"] == "degraded" else EXIT_INVALID_STATE


if __name__ == "__main__":
    raise SystemExit(main())
