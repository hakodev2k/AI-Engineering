#!/usr/bin/env python3
from pathlib import Path
import sys
ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
"README.md","config/policy.yaml","schemas/analysis-result.schema.json","scripts/analyze_message.py","scripts/verify_package.py",
"skills/poison-message-triage.md","skills/dlq-replay-review.md","rules/queue-safety.md","subagents/queue-investigator.md",
"subagents/verification-agent.md","workflows/poison-message-workflow.md","hooks/lifecycle.md","templates/replay-approval.md","tests/test_analyze_message.py"
]
forbidden = ("implementation omitted","remaining files omitted","same as above","continue similarly","TODO")
missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
problems=[]
for rel in REQUIRED:
    p=ROOT/rel
    if p.is_file():
        t=p.read_text(encoding="utf-8",errors="ignore")
        for term in forbidden:
            if term in t: problems.append(f"{rel}: forbidden marker {term}")
if missing or problems:
    for x in missing: print("MISSING",x)
    for x in problems: print("INVALID",x)
    sys.exit(1)
print(f"verified {len(REQUIRED)} files")
