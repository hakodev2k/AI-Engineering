#!/usr/bin/env python3
"""Deterministic requirement/evidence completion gate.

Exit codes:
  0 complete/valid operation
  2 incomplete or blocked
  3 invalid ledger/policy/input
  4 I/O error
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import tempfile
from pathlib import Path
from typing import Any

ALLOWED_STATUSES = {
    "verified", "partially_verified", "implemented", "blocked", "not_addressed", "unknown"
}
ALLOWED_EVIDENCE = {"test", "command", "inspection", "artifact", "diff", "claim"}


def load_json(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read valid JSON from {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data


def atomic_write(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix=path.name + ".", dir=str(path.parent), text=True)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp, path)
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def validate_ledger(ledger: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    if not isinstance(ledger.get("task_id"), str) or not ledger.get("task_id"):
        errors.append("task_id is required")
    reqs = ledger.get("requirements")
    if not isinstance(reqs, list) or not reqs:
        errors.append("requirements must be a non-empty array")
        reqs = []
    seen: set[str] = set()
    for i, req in enumerate(reqs):
        p = f"requirements[{i}]"
        if not isinstance(req, dict):
            errors.append(f"{p} must be an object")
            continue
        rid = req.get("id")
        if not isinstance(rid, str) or not rid:
            errors.append(f"{p}.id is required")
        elif rid in seen:
            errors.append(f"duplicate requirement id: {rid}")
        else:
            seen.add(rid)
        if not isinstance(req.get("text"), str) or not req.get("text"):
            errors.append(f"{p}.text is required")
        if not isinstance(req.get("mandatory"), bool):
            errors.append(f"{p}.mandatory must be boolean")
        if req.get("status") not in ALLOWED_STATUSES:
            errors.append(f"{p}.status is invalid")
        evidence = req.get("evidence")
        if not isinstance(evidence, list):
            errors.append(f"{p}.evidence must be an array")
            evidence = []
        for j, ev in enumerate(evidence):
            ep = f"{p}.evidence[{j}]"
            if not isinstance(ev, dict):
                errors.append(f"{ep} must be an object")
                continue
            if ev.get("type") not in ALLOWED_EVIDENCE:
                errors.append(f"{ep}.type is invalid")
            if not isinstance(ev.get("fresh"), bool):
                errors.append(f"{ep}.fresh must be boolean")
            if not isinstance(ev.get("observed_at"), str) or not ev.get("observed_at"):
                errors.append(f"{ep}.observed_at is required")
    run_state = ledger.get("run_state")
    if not isinstance(run_state, dict) or not isinstance(run_state.get("agent_loop_terminal"), bool):
        errors.append("run_state.agent_loop_terminal must be boolean")
    verdict = ledger.get("verdict")
    if not isinstance(verdict, dict):
        errors.append("verdict must be an object")
    return errors


def fresh_allowed_evidence(req: dict[str, Any], policy: dict[str, Any]) -> list[dict[str, Any]]:
    allowed = set(policy.get("allowed_verified_evidence_types", ["test", "command", "inspection", "artifact"]))
    accepted_codes = set(policy.get("accept_exit_codes", [0]))
    require_exit = bool(policy.get("require_exit_code_for_command_evidence", True))
    result: list[dict[str, Any]] = []
    for ev in req.get("evidence", []):
        if not isinstance(ev, dict) or not ev.get("fresh", False) or ev.get("type") not in allowed:
            continue
        if ev.get("type") in {"command", "test"} and require_exit:
            code = ev.get("exit_code")
            if code is None or code not in accepted_codes:
                continue
        result.append(ev)
    return result


def path_overlaps(changed: str, covered: str) -> bool:
    c = changed.strip("/\\")
    v = covered.strip("/\\")
    if not c or not v:
        return False
    return c == v or c.startswith(v + "/") or v.startswith(c + "/")


def apply_freshness(ledger: dict[str, Any], changed_paths: list[str]) -> int:
    invalidated = 0
    ledger["changed_paths_after_evidence"] = sorted(set(changed_paths))
    for req in ledger.get("requirements", []):
        covered_req = [p for p in req.get("covered_paths", []) if isinstance(p, str)]
        for ev in req.get("evidence", []):
            if not isinstance(ev, dict) or not ev.get("fresh", False):
                continue
            covered = [p for p in ev.get("paths", []) if isinstance(p, str)] or covered_req
            if any(path_overlaps(ch, cov) for ch in changed_paths for cov in covered):
                ev["fresh"] = False
                ev["stale_reason"] = "covered path changed after evidence"
                invalidated += 1
        if req.get("status") == "verified" and not any(
            isinstance(ev, dict) and ev.get("fresh") for ev in req.get("evidence", [])
        ):
            req["status"] = "implemented"
    return invalidated


def evaluate(ledger: dict[str, Any], policy: dict[str, Any]) -> tuple[str, list[str]]:
    reasons: list[str] = []
    run_state = ledger.get("run_state", {})
    if policy.get("fail_closed_on_mid_tool_termination", True) and not run_state.get("agent_loop_terminal", False):
        reasons.append(
            f"agent loop is nonterminal (last_stop_reason={run_state.get('last_stop_reason')!r}, "
            f"process_exit_code={run_state.get('process_exit_code')!r})"
        )

    max_retries = int(policy.get("max_remediation_retries", 2))
    attempts = int(ledger.get("verdict", {}).get("remediation_attempts", 0) or 0)
    if attempts > max_retries:
        reasons.append(f"remediation attempts {attempts} exceed maximum {max_retries}")

    for req in ledger.get("requirements", []):
        if not req.get("mandatory", False):
            continue
        rid = req.get("id", "<unknown>")
        status = req.get("status")
        if status != "verified":
            reasons.append(f"{rid}: mandatory requirement status is {status!r}, not 'verified'")
            continue
        evidence = fresh_allowed_evidence(req, policy)
        if policy.get("require_fresh_evidence_for_verified", True) and not evidence:
            reasons.append(f"{rid}: verified without fresh policy-allowed evidence")

    if reasons:
        if any(req.get("status") == "blocked" and req.get("mandatory") for req in ledger.get("requirements", [])):
            return "blocked", reasons
        return "incomplete", reasons
    return "complete", []


def cmd_validate(args: argparse.Namespace) -> int:
    try:
        ledger = load_json(Path(args.ledger))
        errors = validate_ledger(ledger)
        if errors:
            print(json.dumps({"valid": False, "errors": errors}, indent=2))
            return 3
        print(json.dumps({"valid": True, "requirements": len(ledger["requirements"])}, indent=2))
        return 0
    except ValueError as exc:
        print(json.dumps({"valid": False, "errors": [str(exc)]}, indent=2), file=sys.stderr)
        return 3


def cmd_freshness(args: argparse.Namespace) -> int:
    try:
        ledger_path = Path(args.ledger)
        ledger = load_json(ledger_path)
        errors = validate_ledger(ledger)
        if errors:
            print(json.dumps({"status": "invalid", "errors": errors}, indent=2), file=sys.stderr)
            return 3
        changed = [line.strip() for line in Path(args.changed_paths_file).read_text(encoding="utf-8").splitlines() if line.strip()]
        invalidated = apply_freshness(ledger, changed)
        atomic_write(ledger_path, ledger)
        print(json.dumps({"invalidated_evidence": invalidated, "changed_paths": changed}, indent=2))
        return 0
    except (ValueError, OSError) as exc:
        print(json.dumps({"status": "invalid", "errors": [str(exc)]}, indent=2), file=sys.stderr)
        return 3 if isinstance(exc, ValueError) else 4


def cmd_gate(args: argparse.Namespace) -> int:
    try:
        ledger_path = Path(args.ledger)
        ledger = load_json(ledger_path)
        policy = load_json(Path(args.policy))
        errors = validate_ledger(ledger)
        if errors:
            result = {"status": "invalid", "blocking_reasons": errors}
            if args.report:
                atomic_write(Path(args.report), result)
            print(json.dumps(result, indent=2))
            return 3
        status, reasons = evaluate(ledger, policy)
        ledger.setdefault("verdict", {})["status"] = status
        ledger["verdict"]["blocking_reasons"] = reasons
        atomic_write(ledger_path, ledger)
        result = {
            "task_id": ledger.get("task_id"),
            "status": status,
            "blocking_reasons": reasons,
            "mandatory_requirements": sum(1 for r in ledger.get("requirements", []) if r.get("mandatory")),
            "verified_mandatory_requirements": sum(
                1 for r in ledger.get("requirements", []) if r.get("mandatory") and r.get("status") == "verified"
            ),
        }
        if args.report:
            atomic_write(Path(args.report), result)
        print(json.dumps(result, indent=2))
        return 0 if status == "complete" else 2
    except (ValueError, OSError) as exc:
        result = {"status": "invalid", "blocking_reasons": [str(exc)]}
        print(json.dumps(result, indent=2), file=sys.stderr)
        return 3 if isinstance(exc, ValueError) else 4


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Evidence-backed semantic completion gate")
    sub = p.add_subparsers(dest="command", required=True)

    v = sub.add_parser("validate")
    v.add_argument("--ledger", required=True)
    v.add_argument("--policy", required=False)
    v.set_defaults(func=cmd_validate)

    f = sub.add_parser("freshness")
    f.add_argument("--ledger", required=True)
    f.add_argument("--changed-paths-file", required=True)
    f.set_defaults(func=cmd_freshness)

    g = sub.add_parser("gate")
    g.add_argument("--ledger", required=True)
    g.add_argument("--policy", required=True)
    g.add_argument("--report")
    g.set_defaults(func=cmd_gate)
    return p


def main() -> int:
    return build_parser().parse_args().func(build_parser().parse_args())


if __name__ == "__main__":
    # Parse once here to keep import side effects minimal.
    parser = build_parser()
    ns = parser.parse_args()
    raise SystemExit(ns.func(ns))
