#!/usr/bin/env python3
"""Fail-closed exact-scope gate for destructive actions."""
import hashlib, json, sys, time
from pathlib import Path, PurePosixPath


def load(path):
    try:
        obj = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"{path}: {exc}")
    if not isinstance(obj, dict):
        raise ValueError(f"{path}: expected object")
    return obj


def canon_targets(value):
    if not isinstance(value, list) or not value or not all(isinstance(x, str) and x.strip() for x in value):
        raise ValueError("targets must be a non-empty string list")
    normalized = []
    for raw in value:
        p = PurePosixPath(raw.strip().replace("\\", "/"))
        if p.is_absolute() or ".." in p.parts:
            raise ValueError(f"unsafe/non-relative target: {raw}")
        normalized.append(str(p))
    return sorted(set(normalized))


def under_root(target, root):
    t = PurePosixPath(target); r = PurePosixPath(root)
    return t == r or r in t.parents


def validate(policy, approval, plan, now=None):
    errors = []
    now = int(time.time() if now is None else now)
    op = plan.get("operation")
    destructive = set(policy.get("destructive_operations", []))
    if op not in destructive:
        errors.append(f"operation {op!r} is not declared destructive/known")
    if op != approval.get("operation"):
        errors.append("operation differs from approval")
    try:
        planned = canon_targets(plan.get("targets", []))
        allowed = canon_targets(approval.get("targets", []))
    except ValueError as exc:
        return [str(exc)]
    extra = sorted(set(planned) - set(allowed))
    if extra:
        errors.append("unapproved targets: " + ", ".join(extra))
    expires_at = approval.get("expires_at")
    if not isinstance(expires_at, int) or expires_at < now:
        errors.append("approval expired or invalid")
    nonce = approval.get("nonce")
    if not isinstance(nonce, str) or len(nonce) < 8:
        errors.append("missing/weak nonce")
    human_required = set(policy.get("human_required", []))
    if op in human_required and approval.get("approved_by_type") != "human":
        errors.append("explicit human approval required")
    approved_fp = approval.get("target_fingerprints", {})
    planned_fp = plan.get("target_fingerprints", {})
    if not isinstance(approved_fp, dict) or not isinstance(planned_fp, dict):
        errors.append("fingerprints must be objects")
    else:
        for target in planned:
            if not approved_fp.get(target) or approved_fp.get(target) != planned_fp.get(target):
                errors.append(f"stale/missing fingerprint: {target}")
    roots = policy.get("protected_roots", [])
    if not isinstance(roots, list) or not all(isinstance(x, str) and x for x in roots):
        errors.append("protected_roots must be a string list")
    else:
        protected_hits = [t for t in planned if any(under_root(t, r) for r in roots)]
        if protected_hits and not (approval.get("protected_override") is True and approval.get("approved_by_type") == "human"):
            errors.append("protected target requires explicit human protected_override: " + ", ".join(protected_hits))
    return errors


def main(argv):
    if len(argv) != 4:
        print(f"usage: {argv[0]} <policy.json> <approval.json> <planned-action.json>", file=sys.stderr)
        return 1
    try:
        policy, approval, plan = map(load, argv[1:])
    except ValueError as exc:
        print("ERROR:", exc, file=sys.stderr)
        return 1
    errors = validate(policy, approval, plan)
    if errors:
        print("BLOCK")
        for error in errors:
            print("- " + error)
        return 2
    digest = hashlib.sha256(json.dumps(plan, sort_keys=True).encode()).hexdigest()[:16]
    print(f"PASS action_digest={digest}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
