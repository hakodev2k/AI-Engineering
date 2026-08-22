#!/usr/bin/env python3
import argparse, json, os, sys
from datetime import date, datetime
from pathlib import Path


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"ERROR: cannot read JSON {path}: {exc}", file=sys.stderr)
        sys.exit(2)


def parse_date(value, field, key, errors):
    if value in (None, ""):
        return None
    try:
        return date.fromisoformat(value)
    except ValueError:
        errors.append(f"{key}: {field} must be YYYY-MM-DD")
        return None


def main():
    parser = argparse.ArgumentParser(description="Validate feature flag lifecycle records against policy")
    parser.add_argument("--records", required=True)
    parser.add_argument("--policy", default=os.getenv("FEATURE_FLAG_POLICY", "config/feature-flag-policy.json"))
    args = parser.parse_args()

    records = load_json(Path(args.records))
    policy = load_json(Path(args.policy))
    errors, warnings = [], []

    if not isinstance(records, dict) or not isinstance(records.get("flags"), list):
        print("ERROR: records must be an object containing flags[]", file=sys.stderr)
        return 2

    allowed_types = set(policy.get("allowed_types", []))
    allowed_states = set(policy.get("allowed_states", []))
    temporary = set(policy.get("temporary_types", []))
    protected = set(policy.get("protected_types", []))
    max_days = int(policy.get("max_temporary_lifetime_days", 90))
    seen = set()
    today = date.today()

    for index, flag in enumerate(records["flags"]):
        if not isinstance(flag, dict):
            errors.append(f"flags[{index}] must be an object")
            continue
        key = str(flag.get("key", "")).strip() or f"flags[{index}]"
        if key in seen:
            errors.append(f"{key}: duplicate key")
        seen.add(key)

        required = ["key", "type", "state", "owner", "created_on", "default_behavior", "cleanup_trigger", "verification_status"]
        for field in required:
            if field not in flag:
                errors.append(f"{key}: missing {field}")

        ftype = flag.get("type")
        state = flag.get("state")
        if ftype not in allowed_types:
            errors.append(f"{key}: unsupported type {ftype!r}")
        if state not in allowed_states:
            errors.append(f"{key}: unsupported state {state!r}")

        if state != "retired" and policy.get("require_owner_for_active", True) and not str(flag.get("owner", "")).strip():
            errors.append(f"{key}: active flag requires owner")

        created = parse_date(flag.get("created_on"), "created_on", key, errors)
        expires = parse_date(flag.get("expires_on"), "expires_on", key, errors)

        if ftype in temporary:
            if policy.get("require_expiry_for_temporary", True) and not expires:
                errors.append(f"{key}: temporary flag requires expires_on")
            if policy.get("require_cleanup_trigger_for_temporary", True) and not str(flag.get("cleanup_trigger", "")).strip():
                errors.append(f"{key}: temporary flag requires cleanup_trigger")
            if created and expires:
                lifetime = (expires - created).days
                if lifetime < 0:
                    errors.append(f"{key}: expires_on is before created_on")
                elif lifetime > max_days:
                    errors.append(f"{key}: temporary lifetime {lifetime}d exceeds policy max {max_days}d")
                if expires < today and state not in {"retired", "blocked"}:
                    errors.append(f"{key}: expired on {expires.isoformat()} but state is {state}")

        if ftype in protected and not flag.get("approval_required", False):
            errors.append(f"{key}: protected type requires approval_required=true")

        if state == "retirement-ready" and flag.get("permanent_behavior") not in {"enabled", "disabled"}:
            errors.append(f"{key}: retirement-ready requires known permanent_behavior")
        if state == "retired":
            if flag.get("permanent_behavior") not in {"enabled", "disabled"}:
                errors.append(f"{key}: retired flag requires known permanent_behavior")
            if flag.get("verification_status") != "verified":
                errors.append(f"{key}: retired flag requires verification_status=verified")
            if flag.get("approval_required") and not str(flag.get("approval_ref") or "").strip():
                errors.append(f"{key}: approval_ref required for approved retirement")

        if flag.get("verification_status") == "verified" and state == "blocked":
            errors.append(f"{key}: blocked state cannot be verified")

    if warnings:
        for item in warnings:
            print(f"WARNING: {item}")
    if errors:
        for item in errors:
            print(f"ERROR: {item}", file=sys.stderr)
        print(f"Validation failed: {len(errors)} error(s)", file=sys.stderr)
        return 10

    print(f"Validation passed: {len(records['flags'])} flag record(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())