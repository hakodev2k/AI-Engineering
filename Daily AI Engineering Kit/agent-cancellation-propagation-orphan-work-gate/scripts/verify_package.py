#!/usr/bin/env python3
from pathlib import Path
import sys
REQUIRED=[
"README.md","skills/cancellation-contract-review.md","skills/orphan-work-investigation.md","rules/cancellation-safety.md",
"subagents/repository-explorer.md","subagents/verification-agent.md","workflows/cancellation-propagation-gate.md","hooks/lifecycle.md",
"scripts/cancellation_gate.py","scripts/verify_package.py","config/cancellation-policy.yaml","schemas/cancellation-report.schema.json",
"templates/cancellation-evidence.md","examples/async-sample.py","tests/test_cancellation_gate.py"]
root=Path(__file__).resolve().parents[1]
missing=[p for p in REQUIRED if not (root/p).is_file()]
forbidden=["TODO","implementation omitted","remaining files omitted","same as above","continue similarly","other files omitted for brevity"]
hits=[]
for rel in REQUIRED:
    p=root/rel
    if p.is_file():
        text=p.read_text(encoding="utf-8",errors="ignore")
        hits += [f"{rel}:{term}" for term in forbidden if term.lower() in text.lower()]
if missing or hits:
    print("missing:",missing); print("forbidden:",hits); sys.exit(1)
print(f"package verified: {len(REQUIRED)} required files")
