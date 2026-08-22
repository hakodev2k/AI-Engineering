# Defect Management Rules
## Purpose
Make defects reproducible, correctly prioritized, and useful for preventing recurrence.
## Scope
Defect reporting, triage, severity, evidence, retesting, and closure.
## MUST
- Record observed versus expected behavior, reproduction context, impact, evidence, and relevant version/environment.
- Separate severity from scheduling priority.
- Retest fixes and assess regression risk before closure of material defects.
- Escalate suspected systemic or data-integrity failures promptly.
## MUST NOT
- Close defects solely because they cannot be reproduced once without investigating evidence and conditions.
- Downgrade severity to meet release metrics.
## SHOULD
- Link recurring defects to root-cause and prevention work.
## Exceptions
Intermittent defects may remain probabilistic when evidence, frequency, and diagnostic data are preserved.
## Verification
Audit defect records, severity rationale, retest evidence, recurrence, and escaped-defect trends.