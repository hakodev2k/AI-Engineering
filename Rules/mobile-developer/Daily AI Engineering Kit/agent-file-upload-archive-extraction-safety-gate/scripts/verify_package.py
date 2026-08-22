#!/usr/bin/env python3
from pathlib import Path
import sys
REQ=[
"README.md","config/archive-policy.yaml","schemas/scan-result.schema.json","scripts/archive_safety_gate.py","scripts/verify_package.py","skills/archive-threat-assessment.md","skills/safe-extraction.md","rules/archive-safety.md","subagents/archive-inspector.md","subagents/verification-agent.md","workflows/archive-upload-safety.md","hooks/lifecycle.md","templates/incident-report.md","tests/test_archive_safety_gate.py"
]
root=Path(__file__).resolve().parents[1]
missing=[p for p in REQ if not (root/p).is_file()]
if missing:
    print("Missing required files:")
    for p in missing: print(p)
    sys.exit(2)
for p in REQ:
    text=(root/p).read_text(encoding="utf-8",errors="ignore")
    for banned in ("implementation omitted","remaining files omitted","same as above","continue similarly"):
        if banned in text.lower():
            print(f"Banned placeholder in {p}: {banned}")
            sys.exit(3)
print(f"Package verified: {len(REQ)} required files present")
