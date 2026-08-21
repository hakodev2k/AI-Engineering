#!/usr/bin/env python3
"""Deterministically decide whether an engineering task may be reported complete.

Usage:
  python scripts/completion_gate.py ledger.json

Exit codes:
  0 completion allowed
  2 invalid ledger
  4 completion blocked
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

ALLOWED_STATUSES = {"verified", "implemented_unverified", "partial", "blocked", "not_addressed"}


def load(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError("ledger must be a JSON object")
    return value


def validate_shape(ledger: dict[str, Any]) -> None:
    if not isinstance(ledger.get("task_id"), str) or not ledger["task_id"].strip():
        raise ValueError("task_id must be a non-empty string")
    requirements = ledger.get("requirements")
    evidence = ledger.get("evidence")
    if not isinstance(requirements, list) or not requirements:
        raise ValueError("requirements must be a non-empty array")
    if not isinstance(evidence, list):
        raise ValueError("evidence must be an array")

    req_ids: set[str] = set()
    for req in requirements:
        if not isinstance(req, dict):
            raise ValueError("each requirement must be an object")
        rid = req.get("id")
        if not isinstance(rid, str) or not rid:
            raise ValueError("requirement id must be non-empty string")
        if rid in req_ids:
            raise ValueError(f"duplicate requirement id: {rid}")
        req_ids.add(rid)
        if req.get("status") not in ALLOWED_STATUSES:
            raise ValueError(f"invalid status for {rid}")
        if not isinstance(req.get("required"), bool):
            raise ValueError(f"required must be boolean for {rid}")
        if not isinstance(req.get("evidence_ids", []), list):
            raise ValueError(f"evidence_ids must be array for {rid}")


def effective_stale(ev: dict[str, Any], latest: dict[str, Any]) -> bool:
    if ev.get("stale") is True:
        return True
    seq = ev.get("sequence")
    if not isinstance(seq, int) or isinstance(seq, bool) or seq < 0:
        return True
    paths = ev.get("paths", [])
    if not isinstance(paths, list):
        return True
    for path in paths:
        if isinstance(path, str):
            change_seq = latest.get(path)
            if isinstance(change_seq, int) and change_seq > seq:
                return True
    return False


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("ledger", type=Path)
    args = parser.parse_args()
    try:
        ledger = load(args.ledger)
        validate_shape(ledger)
        latest = ledger.get("latest_change_sequence_by_path", {})
        if not isinstance(latest, dict):
            raise ValueError("latest_change_sequence_by_path must be an object")

        evidence_by_id: dict[str, dict[str, Any]] = {}
        for ev in ledger["evidence"]:
            if not isinstance(ev, dict):
                raise ValueError("each evidence item must be an object")
            eid = ev.get("id")
            if not isinstance(eid, str) or not eid:
                raise ValueError("evidence id must be non-empty string")
            if eid in evidence_by_id:
                raise ValueError(f"duplicate evidence id: {eid}")
            if not isinstance(ev.get("success"), bool):
                raise ValueError(f"evidence success must be boolean: {eid}")
            evidence_by_id[eid] = ev

        rows = []
        blockers = []
        for req in ledger["requirements"]:
            rid = req["id"]
            attached = []
            fresh_success = []
            missing = []
            for eid in req.get("evidence_ids", []):
                ev = evidence_by_id.get(eid)
                if ev is None:
                    missing.append(eid)
                    continue
                stale = effective_stale(ev, latest)
                attached.append({"id": eid, "success": ev.get("success"), "stale": stale, "kind": ev.get("kind")})
                if ev.get("success") is True and not stale:
                    fresh_success.append(eid)

            reasons = []
            status = req["status"]
            required = req["required"]
            accepted = req.get("accepted_exception") is True
            if status == "verified" and not fresh_success:
                reasons.append("verified status has no fresh successful evidence")
            if missing:
                reasons.append(f"missing evidence references: {missing}")
            if required and status != "verified" and not accepted:
                reasons.append(f"required requirement is {status} without accepted exception")
            if required and status == "verified" and not fresh_success:
                reasons.append("required verified requirement lacks fresh evidence")
            if reasons:
                blockers.append({"requirement_id": rid, "reasons": reasons})
            rows.append({"requirement_id": rid, "status": status, "required": required, "accepted_exception": accepted, "evidence": attached, "reasons": reasons})

        decision = "allow" if not blockers else "block"
        output = {
            "decision": decision,
            "task_id": ledger["task_id"],
            "requirements_total": len(rows),
            "blockers": blockers,
            "rows": rows,
        }
        print(json.dumps(output, indent=2))
        return 0 if decision == "allow" else 4
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
