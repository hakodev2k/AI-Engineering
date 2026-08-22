#!/usr/bin/env python3
from pathlib import Path
import os, sys
root=Path(__file__).resolve().parents[1]
required=['README.md','checklists/definition-of-done.md','config/role-config.yaml','examples/architecture-intake.example.json','hooks/lifecycle-hooks.md','knowledge/enterprise-architecture-reasoning.md','knowledge/governance-and-roadmapping.md','metrics/architecture-quality.md','rules/operating-rules.md','schemas/architecture-intake.schema.json','scripts/validate-architecture-intake.py','skills/capability-and-portfolio-analysis.md','skills/target-state-design.md','skills/architecture-decision-governance.md','skills/transition-roadmapping.md','skills/cross-domain-review.md','subagents/business-capability-reviewer.md','subagents/data-integration-reviewer.md','subagents/technology-security-reviewer.md','subagents/portfolio-rationalization-reviewer.md','templates/architecture-intake.md','templates/architecture-decision-record.md','templates/exception-record.md','templates/executive-brief.md','templates/handoff.md','workflows/enterprise-architecture-assessment.md','workflows/target-state-and-roadmap.md','workflows/architecture-review.md','workflows/architecture-incident-response.md']
missing=[p for p in required if not (root/p).exists()]
nonexec=[p for p in root.joinpath('scripts').glob('*.py') if os.name != 'nt' and not (p.stat().st_mode & 0o111)]
if missing or nonexec:
 print('ERROR',{'missing':missing,'nonexec':[str(p.relative_to(root)) for p in nonexec]},file=sys.stderr); sys.exit(1)
print('OK: package manifest valid')
