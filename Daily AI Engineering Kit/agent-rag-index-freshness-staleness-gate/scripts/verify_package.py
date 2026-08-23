#!/usr/bin/env python3
from pathlib import Path
import sys
REQUIRED=[
'README.md','config/freshness-policy.yaml','schemas/freshness-result.schema.json','scripts/freshness_gate.py','scripts/verify_package.py','skills/investigate-stale-retrieval.md','skills/reindex-and-verify.md','rules/rag-freshness-safety.md','subagents/index-freshness-investigator.md','subagents/verification-agent.md','workflows/freshness-gate.md','hooks/lifecycle.md','templates/exception-request.md','examples/metadata-pass.json','examples/metadata-block.json','tests/test_freshness_gate.py']
root=Path(__file__).resolve().parents[1]
missing=[p for p in REQUIRED if not (root/p).exists()]
empty=[p for p in REQUIRED if (root/p).exists() and (root/p).stat().st_size==0]
if missing or empty:
    print('missing:',missing); print('empty:',empty); sys.exit(1)
for p in REQUIRED:
    text=(root/p).read_text(encoding='utf-8',errors='ignore').lower()
    for bad in ('implementation omitted','remaining files omitted','same as above','continue similarly'):
        if bad in text:
            print(f'forbidden placeholder in {p}: {bad}'); sys.exit(1)
print(f'package verification passed: {len(REQUIRED)} files')
