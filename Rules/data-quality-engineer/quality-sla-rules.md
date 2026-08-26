# Data Quality SLA and SLO Rules
## Purpose
Translate consumer expectations into measurable service objectives.
## Scope
Freshness, completeness, correctness, availability, detection, and recovery objectives.
## MUST
- Critical data products MUST define measurable quality objectives tied to consumer impact.
- SLO calculations MUST specify windows, exclusions, measurement source, and ownership.
- Repeated breaches MUST trigger corrective prioritization or explicit risk acceptance.
## MUST NOT
- MUST NOT define objectives that cannot be measured from available evidence.
- MUST NOT reset breach history to conceal reliability problems.
## SHOULD
- Error budgets SHOULD guide trade-offs between delivery speed and quality remediation.
## Exceptions
Temporary objective changes require reason, duration, consumer impact, and approval.
## Verification
Recalculate representative SLOs, inspect source metrics, breach history, ownership, and remediation records.