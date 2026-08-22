# Defect Management Rules

## Purpose
Make defects reproducible, actionable, prioritized, and evidence-based.
## Scope
Defect discovery, reporting, triage, retest, and closure.
## MUST
- Record observed behavior, expected behavior, reproducible conditions, environment, impact, and supporting evidence.
- Separate severity from priority and justify material severity claims by impact.
- Retest fixes and relevant regression surface before closure.
## MUST NOT
- Close a defect solely because it cannot be reproduced once.
- Inflate severity to influence scheduling.
## SHOULD
- Minimize reproduction steps and isolate variables before escalation.
## Exceptions
Security-sensitive defects may restrict reproduction details to authorized channels.
## Verification
Audit defect records for reproducibility, evidence, triage rationale, fix verification, and regression checks.