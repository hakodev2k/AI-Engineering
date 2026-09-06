#!/usr/bin/env python3
"""Deterministic dead-letter queue replay planner and receipt reconciler.

This tool never replays a message. It produces a bounded replay plan from an exported
JSONL file and validates execution receipts after an external replay tool is used.

Exit codes:
  0: validation succeeded
  2: policy blocked or reconciliation failed
  3: invalid input/tooling error
"""
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def load_json(path: Path) -> dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    try:
        for number, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            if not raw.strip():
                continue
            try:
                value = json.loads(raw)
            except json.JSONDecodeError as exc:
                raise ValueError(f"invalid JSONL at {path}:{number}: {exc}") from exc
            if not isinstance(value, dict):
                raise ValueError(f"expected object at {path}:{number}")
            rows.append(value)
    except OSError as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    return rows


def parse_time(value: str) -> datetime:
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise ValueError(f"invalid date-time: {value}") from exc
    if parsed.tzinfo is None:
        raise ValueError(f"date-time must include timezone: {value}")
    return parsed.astimezone(timezone.utc)


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def classify(message: dict[str, Any], policy: dict[str, Any], now: datetime) -> tuple[str, list[str]]:
    reasons: list[str] = []
    message_id = str(message.get("message_id", "")).strip()
    failure_reason = str(message.get("failure_reason", "")).strip()
    failure_class = str(message.get("failure_class", "")).strip()
    idempotency_key = message.get("idempotency_key")
    if policy.get("require_original_message_id", True) and not message_id:
        reasons.append("missing-message-id")
    if policy.get("require_failure_reason", True) and not failure_reason:
        reasons.append("missing-failure-reason")
    if policy.get("require_idempotency_key", True) and not str(idempotency_key or "").strip():
        reasons.append("missing-idempotency-key")
    if failure_class in set(policy.get("block_failure_classes", [])):
        reasons.append(f"blocked-failure-class:{failure_class}")
    failed_at = message.get("failed_at")
    if not isinstance(failed_at, str) or not failed_at.strip():
        reasons.append("missing-failed-at")
    else:
        try:
            failed = parse_time(failed_at)
            age_hours = max(0.0, (now - failed).total_seconds() / 3600)
            if policy.get("require_non_expired_message", True) and age_hours > float(policy.get("max_message_age_hours", 168)):
                reasons.append("message-expired")
        except ValueError:
            reasons.append("invalid-failed-at")
    if any(r.startswith("blocked-failure-class:") for r in reasons):
        return "blocked", reasons
    if any(r in {"missing-message-id", "missing-failure-reason", "missing-failed-at", "invalid-failed-at", "message-expired"} for r in reasons):
        return "blocked", reasons
    if reasons:
        return "needs-review", reasons
    return "eligible", []


def plan(args: argparse.Namespace) -> int:
    policy = load_json(Path(args.policy)).get("policy", {})
    messages = load_jsonl(Path(args.input))
    now = parse_time(args.now) if args.now else datetime.now(timezone.utc)
    max_batch = int(policy.get("max_batch_size", 50))
    if max_batch < 1:
        raise ValueError("max_batch_size must be >= 1")
    seen_ids: set[str] = set()
    seen_keys: set[str] = set()
    results: list[dict[str, Any]] = []
    eligible_count = blocked_count = review_count = 0
    for row in messages:
        status, reasons = classify(row, policy, now)
        mid = str(row.get("message_id", "")).strip()
        key = str(row.get("idempotency_key") or "").strip()
        if mid and mid in seen_ids:
            status = "blocked"; reasons = reasons + ["duplicate-message-id-in-export"]
        if key and key in seen_keys:
            status = "blocked"; reasons = reasons + ["duplicate-idempotency-key-in-export"]
        if mid: seen_ids.add(mid)
        if key: seen_keys.add(key)
        if status == "eligible": eligible_count += 1
        elif status == "blocked": blocked_count += 1
        else: review_count += 1
        results.append({"message_id": mid, "idempotency_key": row.get("idempotency_key"), "status": status, "reasons": reasons, "failure_class": str(row.get("failure_class", "")), "failed_at": str(row.get("failed_at", ""))})
    eligible_ids = [r["message_id"] for r in results if r["status"] == "eligible"]
    batches = [eligible_ids[i:i + max_batch] for i in range(0, len(eligible_ids), max_batch)]
    env_requires_approval = args.environment in set(policy.get("require_approval_for_environment", []))
    overall = "blocked" if blocked_count or review_count or env_requires_approval else "ready"
    output = {"status": overall, "generated_at": now.isoformat().replace("+00:00", "Z"), "environment": args.environment, "source": str(Path(args.input)), "approval_required": env_requires_approval, "summary": {"total": len(results), "eligible": eligible_count, "blocked": blocked_count, "needs_review": review_count}, "batches": batches, "messages": results}
    write_json(Path(args.out), output)
    return 0 if overall == "ready" else 2


def reconcile(args: argparse.Namespace) -> int:
    plan_doc = load_json(Path(args.plan))
    receipts = load_jsonl(Path(args.receipts))
    if plan_doc.get("approval_required") and not args.approved:
        write_json(Path(args.out), {"status": "blocked", "errors": ["required-approval-not-recorded"]})
        return 2
    eligible = {m["message_id"]: m for m in plan_doc.get("messages", []) if m.get("status") == "eligible" and m.get("message_id")}
    receipt_by_id: dict[str, dict[str, Any]] = {}
    errors: list[str] = []
    for receipt in receipts:
        mid = str(receipt.get("message_id", "")).strip()
        if not mid:
            errors.append("receipt-missing-message-id"); continue
        if mid in receipt_by_id: errors.append(f"duplicate-receipt:{mid}")
        receipt_by_id[mid] = receipt
        if mid not in eligible: errors.append(f"receipt-for-non-eligible-message:{mid}")
    for mid, planned in eligible.items():
        receipt = receipt_by_id.get(mid)
        if receipt is None:
            errors.append(f"missing-receipt:{mid}"); continue
        if str(receipt.get("idempotency_key") or "") != str(planned.get("idempotency_key") or ""):
            errors.append(f"idempotency-key-mismatch:{mid}")
        if receipt.get("status") not in {"succeeded", "deduplicated"}:
            errors.append(f"non-success-receipt:{mid}:{receipt.get('status')}")
        if not str(receipt.get("external_receipt") or "").strip():
            errors.append(f"missing-external-receipt:{mid}")
    output = {"status": "verified" if not errors else "failed", "eligible_count": len(eligible), "receipt_count": len(receipts), "errors": sorted(set(errors))}
    write_json(Path(args.out), output)
    return 0 if not errors else 2


def main() -> int:
    parser = argparse.ArgumentParser(); sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser("plan"); p.add_argument("--input", required=True); p.add_argument("--policy", required=True); p.add_argument("--environment", default="development"); p.add_argument("--now"); p.add_argument("--out", required=True); p.set_defaults(func=plan)
    p = sub.add_parser("reconcile"); p.add_argument("--plan", required=True); p.add_argument("--receipts", required=True); p.add_argument("--approved", action="store_true"); p.add_argument("--out", required=True); p.set_defaults(func=reconcile)
    args = parser.parse_args()
    try:
        return args.func(args)
    except (ValueError, OSError, KeyError, TypeError) as exc:
        print(f"dlq_replay_gate: {exc}", file=sys.stderr); return 3

if __name__ == "__main__":
    raise SystemExit(main())
