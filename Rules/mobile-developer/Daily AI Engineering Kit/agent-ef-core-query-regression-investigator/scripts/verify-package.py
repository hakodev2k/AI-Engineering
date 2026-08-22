#!/usr/bin/env python3
from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "README.md",
    "config/query-regression.yaml",
    "rules/query-investigation-rules.md",
    "skills/collect-query-evidence.md",
    "skills/validate-query-fix.md",
    "subagents/query-investigator.md",
    "subagents/query-fix-implementer.md",
    "subagents/query-verifier.md",
    "workflows/ef-core-query-regression.md",
    "hooks/pre-investigation.md",
    "hooks/post-edit-verification.md",
    "scripts/verify-repository.sh",
    "scripts/verify-package.py",
    "schemas/investigation.schema.json",
    "templates/investigation-report.md",
]

missing = [p for p in REQUIRED if not (ROOT / p).is_file()]
empty = [p for p in REQUIRED if (ROOT / p).is_file() and (ROOT / p).stat().st_size == 0]

schema_error = None
try:
    json.loads((ROOT / "schemas/investigation.schema.json").read_text(encoding="utf-8"))
except Exception as exc:
    schema_error = str(exc)

readme = (ROOT / "README.md").read_text(encoding="utf-8") if (ROOT / "README.md").is_file() else ""
unlisted = [p for p in REQUIRED if p != "README.md" and p not in readme]

if missing or empty or schema_error or unlisted:
    if missing:
        print("Missing files:", *missing, sep="\n- ", file=sys.stderr)
    if empty:
        print("Empty files:", *empty, sep="\n- ", file=sys.stderr)
    if schema_error:
        print(f"Invalid JSON schema: {schema_error}", file=sys.stderr)
    if unlisted:
        print("README does not reference:", *unlisted, sep="\n- ", file=sys.stderr)
    sys.exit(1)

print(f"Package verification passed: {len(REQUIRED)} required files present and referenced.")
