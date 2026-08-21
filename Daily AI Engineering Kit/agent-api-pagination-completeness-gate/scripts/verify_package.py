#!/usr/bin/env python3
from pathlib import Path
import sys
required = [
'README.md','config/pagination-policy.yaml','schemas/pagination-result.schema.json','scripts/pagination_gate.py','scripts/verify_package.py',
'skills/pagination-investigation.md','skills/pagination-remediation.md','rules/pagination-safety.md','subagents/api-explorer.md','subagents/verification-agent.md',
'workflows/api-pagination-completeness.md','hooks/lifecycle.md','templates/pagination-report.md','examples/sample-result.json','tests/test_pagination_gate.py']
root = Path(__file__).resolve().parents[1]
missing = [p for p in required if not (root / p).is_file()]
bad = []
for p in required:
    f = root / p
    if f.is_file() and ('TODO' in f.read_text(encoding='utf-8') or 'implementation omitted' in f.read_text(encoding='utf-8')): bad.append(p)
if missing or bad:
    print({'missing':missing,'invalid':bad}); sys.exit(2)
print(f'package verification passed: {len(required)} files')
