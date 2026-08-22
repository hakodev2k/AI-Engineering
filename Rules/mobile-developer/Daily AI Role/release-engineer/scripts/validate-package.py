#!/usr/bin/env python3
from pathlib import Path
import os, sys
ROOT=Path(__file__).resolve().parents[1]
REQUIRED=['README.md','checklists/definition-of-done.md','config/role-config.yaml','examples/release-request.example.json','hooks/lifecycle-hooks.md','knowledge/artifact-provenance-and-promotion.md','knowledge/release-risk-and-rollback.md','metrics/release-quality.md','rules/operating-rules.md','schemas/release-request.schema.json','scripts/validate-package.py','scripts/validate-release-request.py','skills/artifact-and-version-control.md','skills/dependency-and-sequencing.md','skills/release-readiness-assessment.md','skills/release-risk-assessment.md','skills/release-verification.md','skills/rollback-readiness.md','subagents/artifact-provenance-reviewer.md','subagents/dependency-sequencing-reviewer.md','subagents/release-evidence-reviewer.md','subagents/rollback-risk-reviewer.md','templates/emergency-release-record.md','templates/failure-learning-record.md','templates/handoff.md','templates/release-manifest.md','templates/rollback-plan.md','workflows/emergency-hotfix.md','workflows/failed-release-and-rollback.md','workflows/standard-release.md','workflows/versioned-migration-release.md']
def main():
    missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
    empty=[p for p in REQUIRED if (ROOT/p).is_file() and (ROOT/p).stat().st_size==0]
    bad=[]
    for p in ['scripts/validate-package.py','scripts/validate-release-request.py']:
        f=ROOT/p
        if os.name != 'nt' and f.exists() and not (f.stat().st_mode & 0o111): bad.append(p)
    if missing or empty or bad:
        print('INVALID')
        if missing: print('missing:',*missing)
        if empty: print('empty:',*empty)
        if bad: print('not executable:',*bad)
        return 1
    print(f'VALID: {len(REQUIRED)} required files')
    return 0
if __name__=='__main__': sys.exit(main())
