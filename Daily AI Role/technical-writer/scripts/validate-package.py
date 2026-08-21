#!/usr/bin/env python3
from pathlib import Path
import os,sys
ROOT=Path(__file__).resolve().parents[1]
REQ=['README.md','checklists/definition-of-done.md','config/role-config.yaml','examples/documentation-request.example.json','hooks/lifecycle-hooks.md','knowledge/docs-as-code-and-information-architecture.md','knowledge/documentation-quality-and-evidence.md','metrics/documentation-quality.md','rules/operating-rules.md','schemas/documentation-request.schema.json','scripts/validate-documentation-request.py','scripts/validate-package.py','skills/api-and-reference-documentation.md','skills/audience-and-task-analysis.md','skills/content-architecture.md','skills/technical-accuracy-verification.md','skills/troubleshooting-and-runbook-writing.md','skills/versioned-change-documentation.md','subagents/audience-reviewer.md','subagents/example-verifier.md','subagents/technical-accuracy-reviewer.md','subagents/terminology-consistency-reviewer.md','templates/content-plan.md','templates/failure-learning-record.md','templates/handoff.md','templates/source-map.md','templates/technical-review-request.md','workflows/documentation-change.md','workflows/documentation-incident-response.md','workflows/new-documentation-set.md','workflows/release-and-migration-docs.md']
errs=[]
for p in REQ:
    q=ROOT/p
    if not q.is_file(): errs.append('missing '+p)
for p in ['scripts/validate-documentation-request.py','scripts/validate-package.py']:
    q=ROOT/p
    if q.exists() and not os.access(q,os.X_OK): errs.append('not executable '+p)
if errs:
    print('\n'.join('ERROR: '+e for e in errs),file=sys.stderr); sys.exit(1)
print(f'OK: {len(REQ)} required files present; scripts executable')