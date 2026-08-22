#!/usr/bin/env python3
"""Validate observable end-to-end interrupt liveness from JSONL lifecycle events.

Exit codes: 0=effective, 2=invalid evidence/config, 4=degraded/manual review,
5=blocking liveness/integrity violation.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

EFFECTIVE, INVALID, DEGRADED, BLOCK = 0, 2, 4, 5
REQUIRED_FIELDS = {"run_id", "execution_id", "epoch", "event", "t_ms"}
ALLOWED_EVENTS = {
    "interrupt_ingress", "interrupt_ack", "cancel_effective",
    "descendant_started", "descendant_terminal", "side_effect_admitted",
    "transcript_repaired", "resume_reconciled", "fixture_finished"
}


def load_policy(path: Path) -> dict[str, Any]:
    try:
        p = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read policy: {exc}") from exc
    if not isinstance(p, dict):
        raise ValueError("policy must be a JSON object")
    numeric = ["ack_deadline_ms", "cancel_effective_deadline_ms", "descendant_drain_deadline_ms",
               "maximum_post_cancel_side_effects", "maximum_orphans_after_grace"]
    for key in numeric:
        if not isinstance(p.get(key), (int, float)) or p[key] < 0:
            raise ValueError(f"{key} must be a non-negative number")
    return p


def load_events(path: Path) -> list[dict[str, Any]]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read events: {exc}") from exc
    rows: list[dict[str, Any]] = []
    for line_no, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"line {line_no}: invalid JSON: {exc}") from exc
        if not isinstance(row, dict):
            raise ValueError(f"line {line_no}: event must be an object")
        missing = REQUIRED_FIELDS - row.keys()
        if missing:
            raise ValueError(f"line {line_no}: missing {sorted(missing)}")
        if row["event"] not in ALLOWED_EVENTS:
            raise ValueError(f"line {line_no}: unknown event {row['event']!r}")
        if not isinstance(row["epoch"], int) or row["epoch"] < 1:
            raise ValueError(f"line {line_no}: epoch must be a positive integer")
        if not isinstance(row["t_ms"], (int, float)) or row["t_ms"] < 0:
            raise ValueError(f"line {line_no}: t_ms must be non-negative")
        if not isinstance(row["run_id"], str) or not row["run_id"]:
            raise ValueError(f"line {line_no}: run_id required")
        if not isinstance(row["execution_id"], str) or not row["execution_id"]:
            raise ValueError(f"line {line_no}: execution_id required")
        rows.append(row)
    if not rows:
        raise ValueError("no lifecycle events")
    rows.sort(key=lambda r: (r["t_ms"], r["event"]))
    return rows


def one(rows: list[dict[str, Any]], event: str, epoch: int) -> dict[str, Any] | None:
    found = [r for r in rows if r["event"] == event and r["epoch"] == epoch]
    return found[0] if found else None


def analyze(rows: list[dict[str, Any]], policy: dict[str, Any]) -> dict[str, Any]:
    run_ids = {r["run_id"] for r in rows}
    if len(run_ids) != 1:
        raise ValueError("events must describe exactly one run_id")
    ingress_events = [r for r in rows if r["event"] == "interrupt_ingress"]
    if len(ingress_events) != 1:
        raise ValueError("exactly one interrupt_ingress event is required per fixture")
    ingress = ingress_events[0]
    epoch = ingress["epoch"]
    if policy.get("require_monotonic_interrupt_epoch", True):
        later_epochs = [r["epoch"] for r in rows if r["t_ms"] >= ingress["t_ms"]]
        if any(e < epoch for e in later_epochs):
            raise ValueError("stale interrupt epoch observed after ingress")

    ack = one(rows, "interrupt_ack", epoch)
    effective = one(rows, "cancel_effective", epoch)
    violations: list[str] = []
    degraded: list[str] = []
    metrics: dict[str, Any] = {}

    if not ack:
        violations.append("missing_interrupt_ack")
    else:
        metrics["ack_latency_ms"] = ack["t_ms"] - ingress["t_ms"]
        if metrics["ack_latency_ms"] < 0 or metrics["ack_latency_ms"] > policy["ack_deadline_ms"]:
            violations.append("ack_deadline_exceeded")

    if not effective:
        violations.append("missing_cancel_effective")
    else:
        metrics["cancel_effective_latency_ms"] = effective["t_ms"] - ingress["t_ms"]
        if metrics["cancel_effective_latency_ms"] < 0 or metrics["cancel_effective_latency_ms"] > policy["cancel_effective_deadline_ms"]:
            violations.append("cancel_effective_deadline_exceeded")

    side_effects = [r for r in rows if r["event"] == "side_effect_admitted" and r["epoch"] == epoch and r["t_ms"] >= ingress["t_ms"]]
    metrics["post_cancel_side_effects"] = len(side_effects)
    if len(side_effects) > policy["maximum_post_cancel_side_effects"]:
        violations.append("post_cancel_side_effect_admitted")

    started: dict[str, float] = {}
    terminal: dict[str, float] = {}
    for r in rows:
        if r["epoch"] != epoch:
            continue
        if r["event"] == "descendant_started":
            started[r["execution_id"]] = r["t_ms"]
        elif r["event"] == "descendant_terminal":
            terminal[r["execution_id"]] = r["t_ms"]
    finish = one(rows, "fixture_finished", epoch)
    observation_end = finish["t_ms"] if finish else rows[-1]["t_ms"]
    drain_start = effective["t_ms"] if effective else ingress["t_ms"]
    drain_deadline = drain_start + policy["descendant_drain_deadline_ms"]
    orphans = []
    drain_latencies = []
    for execution_id in started:
        term = terminal.get(execution_id)
        if term is not None:
            drain_latencies.append(term - drain_start)
            if term > drain_deadline:
                orphans.append(execution_id)
        elif observation_end >= drain_deadline:
            orphans.append(execution_id)
        else:
            degraded.append(f"insufficient_observation_window_for:{execution_id}")
    metrics["orphan_count_after_grace"] = len(orphans)
    metrics["max_descendant_drain_latency_ms"] = max(drain_latencies) if drain_latencies else 0
    if len(orphans) > policy["maximum_orphans_after_grace"]:
        violations.append("descendant_not_drained")

    if policy.get("require_transcript_repair", True) and not one(rows, "transcript_repaired", epoch):
        violations.append("transcript_not_repaired")
    if policy.get("require_resume_reconciliation", True) and not one(rows, "resume_reconciled", epoch):
        violations.append("resume_not_reconciled")

    report = {
        "run_id": next(iter(run_ids)),
        "epoch": epoch,
        "metrics": metrics,
        "orphan_execution_ids": sorted(orphans),
        "violations": sorted(set(violations)),
        "degraded_reasons": sorted(set(degraded)),
    }
    if violations:
        report.update(decision="block", reason="interrupt_control_plane_invariant_failed")
    elif degraded:
        report.update(decision="degraded", reason="insufficient_evidence_for_full_verification")
    else:
        report.update(decision="effective", reason="all_interrupt_liveness_invariants_passed")
    return report


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("events", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    parser.add_argument("--strict", action="store_true", help="treat degraded evidence as blocking exit")
    args = parser.parse_args()
    try:
        report = analyze(load_events(args.events), load_policy(args.policy))
    except ValueError as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(report, indent=2))
    if report["decision"] == "block":
        return BLOCK
    if report["decision"] == "degraded":
        return BLOCK if args.strict else DEGRADED
    return EFFECTIVE


if __name__ == "__main__":
    raise SystemExit(main())
