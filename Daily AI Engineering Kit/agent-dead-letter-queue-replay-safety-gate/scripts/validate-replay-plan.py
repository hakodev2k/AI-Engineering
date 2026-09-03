#!/usr/bin/env python3
import argparse
import hashlib
import json
import sys
from pathlib import Path


def main():
    p = argparse.ArgumentParser(description="Validate a bounded DLQ replay plan")
    p.add_argument("--plan", required=True)
    p.add_argument("--config", required=True)
    args = p.parse_args()
    try:
        raw = Path(args.plan).read_bytes()
        plan = json.loads(raw)
        cfg = json.loads(Path(args.config).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    errors = []
    if not isinstance(plan, dict):
        errors.append("plan must be a JSON object")
    else:
        for field in cfg.get("required_plan_fields", []):
            if field not in plan:
                errors.append(f"missing required field: {field}")
        ids = plan.get("message_ids")
        if not isinstance(ids, list) or not ids or any(not isinstance(x, str) or not x.strip() for x in ids):
            errors.append("message_ids must be a non-empty array of non-empty strings")
        elif len(ids) != len(set(ids)):
            errors.append("message_ids contains duplicates")
        elif len(ids) > int(cfg["max_batch_size"]):
            errors.append(f"batch size {len(ids)} exceeds max_batch_size {cfg['max_batch_size']}")
        env = str(plan.get("environment", "")).lower()
        approval_required = bool(plan.get("approval_required")) or env in {"prod", "production"}
        approval_ref = plan.get("approval_reference")
        if approval_required and not approval_ref:
            errors.append("approval_reference is required for this plan")
        failure = plan.get("failure_classification")
        if failure in cfg.get("permanent_failure_classes", []):
            errors.append(f"permanent failure classification is not replayable by default: {failure}")
        if failure in (None, "", "unknown") and cfg.get("block_unknown_failure_class", True):
            errors.append("unknown failure classification blocks replay")
        if cfg.get("require_idempotency_evidence_for_side_effects", True) and not str(plan.get("idempotency_evidence", "")).strip():
            errors.append("idempotency_evidence is required")

    if errors:
        for err in errors:
            print(f"error: {err}", file=sys.stderr)
        return 1
    print(f"valid plan sha256={hashlib.sha256(raw).hexdigest()} messages={len(plan['message_ids'])}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
