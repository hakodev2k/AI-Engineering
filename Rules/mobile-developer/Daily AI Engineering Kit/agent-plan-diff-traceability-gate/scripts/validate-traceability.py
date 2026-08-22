#!/usr/bin/env python3
import fnmatch
import hashlib
import json
import pathlib
import sys


def canonical(obj):
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def fingerprint(obj):
    return hashlib.sha256(canonical(obj)).hexdigest()


def load(path):
    return json.loads(pathlib.Path(path).read_text(encoding="utf-8"))


def allowed(path, patterns):
    return any(fnmatch.fnmatch(path, pat) for pat in patterns)


def main():
    if len(sys.argv) != 4:
        print("usage: validate-traceability.py <plan.json> <manifest.json> <policy.json>", file=sys.stderr)
        return 2
    try:
        plan, manifest, policy = map(load, sys.argv[1:])
    except Exception as exc:
        print(json.dumps({"status":"blocked","errors":[f"invalid-json:{exc}"]}, indent=2))
        return 2

    errors, warnings = [], []
    plan_fp = fingerprint(plan)
    if policy.get("require_plan_fingerprint", True) and manifest.get("plan_fingerprint") != plan_fp:
        errors.append("plan-fingerprint-mismatch")
    if manifest.get("task_id") != plan.get("task_id"):
        errors.append("task-id-mismatch")
    items = {x["id"]: x for x in plan.get("plan_items", [])}
    if len(items) != len(plan.get("plan_items", [])):
        errors.append("duplicate-plan-item-id")

    mapped_counts = {k:0 for k in items}
    high_risk = set(policy.get("high_risk_categories", []))
    approval_required = set(policy.get("approval_required_categories", []))

    for change in manifest.get("changes", []):
        path = change.get("path", "")
        mapped = change.get("plan_item_ids", [])
        if not mapped and policy.get("require_all_changed_files_mapped", True):
            errors.append(f"unmapped-change:{path}")
            continue
        unknown = [pid for pid in mapped if pid not in items]
        if unknown:
            errors.append(f"unknown-plan-item:{path}:{','.join(unknown)}")
            continue
        for pid in mapped:
            mapped_counts[pid] += 1
            if not allowed(path, items[pid].get("allowed_paths", [])):
                errors.append(f"path-outside-plan-scope:{path}:{pid}")
        cats = set(change.get("risk_categories", []))
        if cats & approval_required and not change.get("approval_id"):
            errors.append(f"approval-missing:{path}")
        if cats & high_risk and len(mapped) == 0:
            errors.append(f"high-risk-unmapped:{path}")
        if not change.get("acceptance_criteria"):
            warnings.append(f"no-acceptance-criteria:{path}")

    max_files = int(policy.get("max_changed_files_per_plan_item", 20))
    for pid, count in mapped_counts.items():
        if count > max_files:
            errors.append(f"plan-item-file-count-exceeded:{pid}:{count}>{max_files}")

    status_rows = {x.get("id"):x for x in manifest.get("plan_item_status", [])}
    if policy.get("require_all_plan_items_accounted_for", True):
        for pid in items:
            row = status_rows.get(pid)
            if not row:
                errors.append(f"plan-item-unaccounted:{pid}")
            elif row.get("status") == "pending":
                errors.append(f"plan-item-pending:{pid}")
            elif row.get("status") == "implemented" and not row.get("evidence"):
                errors.append(f"implemented-without-evidence:{pid}")

    result = {
        "status": "blocked" if errors else ("review-required" if warnings else "verified"),
        "plan_fingerprint": plan_fp,
        "manifest_fingerprint": fingerprint(manifest),
        "errors": errors,
        "warnings": warnings
    }
    print(json.dumps(result, indent=2))
    return 5 if errors else (4 if warnings else 0)


if __name__ == "__main__":
    raise SystemExit(main())
