# Production Incident Rules
## Purpose
Contain field incidents quickly while preserving evidence and preventing unsafe recurrence.
## Scope
Robot fleet incidents, near misses, unexpected motion, service degradation, and recovery.
## MUST
- Prioritize human safety and energy containment before service restoration.
- Preserve relevant logs, versions, configuration, sensor evidence, and physical state when feasible.
- Bound affected fleet scope using evidence and disable unsafe capability when necessary.
- Require explicit authorization before returning a robot to service after a safety-significant incident.
- Track corrective actions to verified closure.
## MUST NOT
- Erase or overwrite incident evidence merely to restore operation.
- Claim root cause without evidence sufficient to distinguish plausible alternatives.
## SHOULD
- Separate immediate mitigation from permanent corrective action and perform blameless technical review.
## Exceptions
Evidence collection may be curtailed when continued collection increases physical risk; document what was lost and why.
## Verification
Review incident timeline, preserved artifacts, containment actions, approvals, root-cause evidence, regression tests, and closure records.