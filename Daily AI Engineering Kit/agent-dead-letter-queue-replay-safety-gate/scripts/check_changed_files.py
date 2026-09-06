#!/usr/bin/env python3
"""Block dangerous file categories unless an explicit approval record is supplied."""
from __future__ import annotations
import argparse
import json
import subprocess
import sys
from pathlib import Path

SENSITIVE_PREFIXES = ("infra/", "infrastructure/", "terraform/", "migrations/", "database/migrations/")
SENSITIVE_NAMES = {".env", ".env.production", "secrets.json", "appsettings.Production.json"}

def changed(base: str) -> list[str]:
    p = subprocess.run(["git", "diff", "--name-only", base, "--"], text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if p.returncode: raise RuntimeError(p.stderr.strip() or "git diff failed")
    return [line.strip() for line in p.stdout.splitlines() if line.strip()]

def main() -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("--base", default="HEAD"); ap.add_argument("--approval-file"); ap.add_argument("--out", required=True); args = ap.parse_args()
    try: files = changed(args.base)
    except RuntimeError as exc: print(exc, file=sys.stderr); return 3
    sensitive = [f for f in files if f in SENSITIVE_NAMES or f.startswith(SENSITIVE_PREFIXES)]
    approved = False
    if args.approval_file:
        try:
            data = json.loads(Path(args.approval_file).read_text(encoding="utf-8")); approved = data.get("approved") is True and bool(data.get("approver")) and bool(data.get("reason"))
        except (OSError, json.JSONDecodeError): approved = False
    result = {"status": "pass" if not sensitive or approved else "blocked", "changed_files": files, "sensitive_files": sensitive, "approval_valid": approved}
    Path(args.out).parent.mkdir(parents=True, exist_ok=True); Path(args.out).write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return 0 if result["status"] == "pass" else 2

if __name__ == "__main__": raise SystemExit(main())
