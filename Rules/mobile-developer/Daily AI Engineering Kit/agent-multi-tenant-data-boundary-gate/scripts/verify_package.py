#!/usr/bin/env python3
from pathlib import Path
import sys

REQUIRED = [
    "README.md",
    "config/policy.yaml",
    "schemas/boundary-result.schema.json",
    "rules/multi-tenant-safety.md",
    "skills/tenant-boundary-review.md",
    "subagents/boundary-explorer.md",
    "subagents/boundary-planner.md",
    "subagents/boundary-implementer.md",
    "subagents/boundary-verifier.md",
    "workflows/tenant-boundary-workflow.md",
    "hooks/lifecycle.md",
    "scripts/tenant_boundary_gate.py",
    "templates/operation-manifest.json",
    "examples/safe-read.json",
    "examples/unsafe-write.json",
    "tests/test_tenant_boundary_gate.py"
]

def main():
    root = Path(__file__).resolve().parents[1]
    missing = [p for p in REQUIRED if not (root / p).is_file()]
    empty = [p for p in REQUIRED if (root / p).is_file() and (root / p).stat().st_size == 0]
    bad = []
    for p in REQUIRED:
        f = root / p
        if f.is_file():
            text = f.read_text(encoding="utf-8", errors="ignore").lower()
            for marker in ["implementation omitted", "remaining files omitted", "same as above", "add logic here", "continue similarly", "other files omitted for brevity"]:
                if marker in text:
                    bad.append((p, marker))
    if missing or empty or bad:
        print({"missing": missing, "empty": empty, "forbidden_markers": bad})
        return 1
    print(f"verified {len(REQUIRED)} package files")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
