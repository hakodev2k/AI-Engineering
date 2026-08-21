#!/usr/bin/env python3
import sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
"README.md","config/ambiguity-gate.yaml","schemas/requirement-contract.schema.json","templates/requirement-contract.example.json",
"scripts/validate-requirement-contract.py","scripts/check-package.py","skills/requirement-clarification.md","skills/repository-evidence.md",
"rules/requirement-safety.md","subagents/requirement-analyst.md","subagents/requirement-verifier.md","workflows/ambiguity-gate-workflow.md","hooks/hooks.md"
]
missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
if missing:
    print("ERROR missing package files:\n"+"\n".join(missing), file=sys.stderr); sys.exit(1)
for rel in ["README.md","workflows/ambiguity-gate-workflow.md","hooks/hooks.md"]:
    text=(ROOT/rel).read_text(encoding="utf-8")
    for target in REQUIRED:
        if target in text and not (ROOT/target).exists():
            print(f"ERROR broken reference {target} in {rel}", file=sys.stderr); sys.exit(1)
print(f"OK: package contains all {len(REQUIRED)} required files")
