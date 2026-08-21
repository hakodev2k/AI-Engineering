#!/usr/bin/env python3
import argparse
import copy
import hashlib
import json
import os
import sys
import time
from pathlib import Path

DEFAULT_REQUIRED = [
    "task_id", "generation", "active_turn", "active_goal", "constraints",
    "decisions", "completed", "failed_approaches", "open_items", "blockers",
    "evidence_refs"
]


def load_json(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        fail(f"file not found: {path}", 2)
    except json.JSONDecodeError as e:
        fail(f"invalid JSON in {path}: {e}", 2)


def fail(msg, code=1):
    print(json.dumps({"status": "error", "message": msg}, ensure_ascii=False))
    raise SystemExit(code)


def canonical_without_checksum(obj):
    clone = copy.deepcopy(obj)
    clone.pop("checksum", None)
    return json.dumps(clone, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def checksum(obj):
    return "sha256:" + hashlib.sha256(canonical_without_checksum(obj)).hexdigest()


def dotted_get(obj, path):
    cur = obj
    for part in path.split("."):
        if not isinstance(cur, dict) or part not in cur:
            return None, False
        cur = cur[part]
    return cur, True


def validate_capsule(capsule, policy=None, verify_checksum=True):
    errors = []
    for key in DEFAULT_REQUIRED:
        if key not in capsule:
            errors.append(f"missing required field: {key}")
    if not isinstance(capsule.get("generation"), int) or capsule.get("generation", -1) < 0:
        errors.append("generation must be a non-negative integer")
    active_turn = capsule.get("active_turn")
    if not isinstance(active_turn, dict) or not active_turn.get("id"):
        errors.append("active_turn.id is required")
    for key in ["constraints", "decisions", "completed", "failed_approaches", "open_items", "blockers", "evidence_refs"]:
        if key in capsule and not isinstance(capsule[key], list):
            errors.append(f"{key} must be an array")

    if policy:
        max_bytes = int(policy.get("max_capsule_bytes", 0) or 0)
        actual_bytes = len(canonical_without_checksum(capsule))
        if max_bytes and actual_bytes > max_bytes:
            errors.append(f"capsule exceeds max_capsule_bytes: {actual_bytes}>{max_bytes}")
        if policy.get("require_evidence_for_decisions"):
            for i, item in enumerate(capsule.get("decisions", [])):
                if not isinstance(item, dict) or not item.get("evidence_refs"):
                    errors.append(f"decisions[{i}] requires evidence_refs")
        if policy.get("require_reason_for_failed_approaches"):
            for i, item in enumerate(capsule.get("failed_approaches", [])):
                if not isinstance(item, dict) or not item.get("reason"):
                    errors.append(f"failed_approaches[{i}] requires reason")
        if policy.get("require_artifact_for_completed_items"):
            for i, item in enumerate(capsule.get("completed", [])):
                if not isinstance(item, dict) or not (item.get("artifact_refs") or item.get("evidence_refs")):
                    errors.append(f"completed[{i}] requires artifact_refs or evidence_refs")

    if verify_checksum:
        expected = capsule.get("checksum")
        actual = checksum(capsule)
        if not expected:
            errors.append("checksum is required")
        elif expected != actual:
            errors.append(f"checksum mismatch: expected {expected}, calculated {actual}")
    return errors


def cmd_stamp(args):
    path = Path(args.capsule)
    capsule = load_json(path)
    capsule["checksum"] = checksum(capsule)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.parent.mkdir(parents=True, exist_ok=True)
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(capsule, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write("\n")
    os.replace(tmp, path)
    print(json.dumps({"status": "stamped", "checksum": capsule["checksum"], "capsule": str(path)}))


def cmd_validate(args):
    capsule = load_json(args.capsule)
    policy = load_json(args.policy) if args.policy else None
    errors = validate_capsule(capsule, policy, verify_checksum=True)
    if errors:
        print(json.dumps({"status": "invalid", "errors": errors}, ensure_ascii=False, indent=2))
        raise SystemExit(1)
    print(json.dumps({"status": "valid", "checksum": capsule["checksum"]}))


def critical_paths(policy):
    return policy.get("critical_fields") or [
        "task_id", "generation", "active_turn.id", "active_goal", "constraints",
        "decisions", "completed", "failed_approaches", "open_items", "blockers", "evidence_refs"
    ]


def compare(before, after, policy):
    mismatches = []
    for path in critical_paths(policy):
        bv, bok = dotted_get(before, path)
        av, aok = dotted_get(after, path)
        if not bok or not aok:
            mismatches.append({"field": path, "before_present": bok, "after_present": aok, "reason": "missing"})
        elif bv != av:
            mismatches.append({"field": path, "before": bv, "after": av, "reason": "changed"})
    return mismatches


def load_valid_pair(args):
    before = load_json(args.before)
    after = load_json(args.after)
    policy = load_json(args.policy)
    before_errors = validate_capsule(before, policy, verify_checksum=True)
    after_errors = validate_capsule(after, policy, verify_checksum=True)
    if before_errors or after_errors:
        print(json.dumps({"status": "invalid", "before_errors": before_errors, "after_errors": after_errors}, ensure_ascii=False, indent=2))
        raise SystemExit(1)
    return before, after, policy


def cmd_compare(args):
    before, after, policy = load_valid_pair(args)
    mismatches = compare(before, after, policy)
    status = "valid" if not mismatches else "invalid"
    print(json.dumps({"status": status, "mismatches": mismatches}, ensure_ascii=False, indent=2))
    raise SystemExit(0 if status == "valid" else 1)


def cmd_receipt(args):
    before, after, policy = load_valid_pair(args)
    mismatches = compare(before, after, policy)
    if mismatches:
        print(json.dumps({"status": "invalid", "mismatches": mismatches}, ensure_ascii=False, indent=2))
        raise SystemExit(1)
    now = int(time.time())
    receipt = {
        "status": "valid",
        "issued_at_epoch": now,
        "max_age_seconds": args.max_age_seconds,
        "task_id": before.get("task_id"),
        "active_turn_id": before.get("active_turn", {}).get("id"),
        "before_checksum": before.get("checksum"),
        "after_checksum": after.get("checksum")
    }
    receipt["receipt_hash"] = "sha256:" + hashlib.sha256(
        json.dumps(receipt, sort_keys=True, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    print(json.dumps(receipt, ensure_ascii=False, indent=2))


def build_parser():
    p = argparse.ArgumentParser(description="Validate task continuity across agent context compaction.")
    sub = p.add_subparsers(dest="command", required=True)

    s = sub.add_parser("stamp")
    s.add_argument("--capsule", required=True)
    s.set_defaults(func=cmd_stamp)

    v = sub.add_parser("validate")
    v.add_argument("--capsule", required=True)
    v.add_argument("--policy")
    v.set_defaults(func=cmd_validate)

    c = sub.add_parser("compare")
    c.add_argument("--before", required=True)
    c.add_argument("--after", required=True)
    c.add_argument("--policy", required=True)
    c.set_defaults(func=cmd_compare)

    r = sub.add_parser("receipt")
    r.add_argument("--before", required=True)
    r.add_argument("--after", required=True)
    r.add_argument("--policy", required=True)
    r.add_argument("--max-age-seconds", type=int, default=300)
    r.set_defaults(func=cmd_receipt)
    return p


if __name__ == "__main__":
    parser = build_parser()
    ns = parser.parse_args()
    ns.func(ns)
