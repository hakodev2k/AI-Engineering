#!/usr/bin/env python3
import argparse
import re
import sys
from pathlib import Path

REQUIRED_KEYS = [
    "version:", "status:", "database:", "engine:", "target_environment:",
    "migration:", "files:", "affected_objects:", "operations:", "risk:",
    "prechecks:", "dry_run:", "rollback:", "verification:", "approval:",
    "evidence:", "unresolved_risks:"
]
ALLOWED_STATUS = {"planned", "blocked", "needs-approval", "dry-run-passed", "verified"}

def scalar(text: str, key: str):
    m = re.search(rf"(?m)^\s*{re.escape(key)}:\s*[\"']?([^\n\"']*)", text)
    return m.group(1).strip() if m else None

def boolean(text: str, key: str):
    value = scalar(text, key)
    if value is None:
        return None
    value = value.lower()
    if value == "true": return True
    if value == "false": return False
    return None

def main():
    parser = argparse.ArgumentParser(description="Validate required migration-plan safety fields without external dependencies.")
    parser.add_argument("plan")
    args = parser.parse_args()
    path = Path(args.plan)
    if not path.is_file():
        print(f"ERROR: plan not found: {path}", file=sys.stderr)
        return 2
    text = path.read_text(encoding="utf-8", errors="replace")
    errors = []
    for key in REQUIRED_KEYS:
        if key not in text:
            errors.append(f"missing required key: {key}")
    status = scalar(text, "status")
    if status not in ALLOWED_STATUS:
        errors.append(f"invalid status: {status!r}")
    target = scalar(text, "target_environment")
    if not target:
        errors.append("target_environment must be explicit")
    if target and target.lower() in {"prod", "production"}:
        errors.append("automated gate refuses a production target")
    rollback_strategy = scalar(text, "strategy")
    if not rollback_strategy:
        errors.append("rollback.strategy must be populated")
    dry_run_command = scalar(text, "command")
    if not dry_run_command:
        errors.append("at least one concrete command field must be populated; dry-run command is empty")
    required = boolean(text, "required")
    approved_by = scalar(text, "approved_by")
    if required is True and not approved_by:
        errors.append("approval is required but approved_by is empty")
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print("migration plan validation passed")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
