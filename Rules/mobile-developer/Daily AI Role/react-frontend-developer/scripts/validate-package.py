#!/usr/bin/env python3
from pathlib import Path
import os, sys
ROOT=Path(__file__).resolve().parents[1]
REQ=['README.md','checklists/definition-of-done.md','config/role-config.yaml','examples/frontend-change.example.json','hooks/lifecycle-hooks.md','knowledge/react-engineering-principles.md','knowledge/accessibility-performance.md','metrics/frontend-quality.md','rules/operating-rules.md','schemas/frontend-change.schema.json','scripts/validate-frontend-change.py','skills/component-architecture.md','skills/api-data-flow.md','skills/forms-and-interaction-state.md','skills/accessibility-implementation.md','skills/frontend-testing.md','skills/performance-debugging.md','subagents/component-reviewer.md','subagents/accessibility-reviewer.md','subagents/test-risk-reviewer.md','subagents/performance-reviewer.md','templates/change-plan.md','templates/review-handoff.md','templates/incident-record.md','workflows/feature-delivery.md','workflows/frontend-defect.md','workflows/api-contract-change.md','workflows/performance-regression.md']
def main():
    missing=[p for p in REQ if not (ROOT/p).is_file()]
    if missing:
        print('ERROR: missing files: '+', '.join(missing),file=sys.stderr); return 1
    for p in ['scripts/validate-frontend-change.py','scripts/validate-package.py']:
        if os.name != 'nt' and not os.access(ROOT/p,os.X_OK): print(f'ERROR: not executable: {p}',file=sys.stderr); return 1
    print(f'OK: package manifest valid ({len(REQ)+1} files including validator)'); return 0
if __name__=='__main__': sys.exit(main())
