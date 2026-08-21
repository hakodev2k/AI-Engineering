#!/usr/bin/env python3
from pathlib import Path
import sys
REQUIRED=['README.md','config/secret-policy.yaml','scripts/secret_diff_gate.py','scripts/verify_package.py','skills/secret-diff-investigation.md','skills/secret-remediation.md','rules/secret-safety.md','subagents/secret-investigator.md','subagents/independent-verifier.md','workflows/secret-exposure-gate.md','hooks/lifecycle.md','schemas/scan-result.schema.json','templates/allowlist-entry.json','tests/test_secret_diff_gate.py']
root=Path(__file__).resolve().parents[1]
missing=[p for p in REQUIRED if not (root/p).exists()]
if missing:
    print('Missing files:'); [print('-',x) for x in missing]; sys.exit(2)
for p in REQUIRED:
    if (root/p).stat().st_size==0:
        print('Empty file:',p); sys.exit(3)
print(f'Package verified: {len(REQUIRED)} required files present and non-empty.')
