# Incident Response Rules
## Purpose
Restore database service safely while preserving evidence and data correctness.
## Scope
Outages, severe degradation, corruption, failed changes, and recovery actions.
## MUST
- Establish impact, timeline, recent changes, and available evidence before broad corrective actions when time permits.
- Prioritize containment and reversible recovery actions consistent with incident severity.
- Preserve logs, metrics, traces, deadlock data, and relevant state needed for root-cause analysis.
## MUST NOT
- Perform destructive repair, failover, restore, or data deletion without required human authorization.
- Hide uncertainty or declare root cause without evidence.
## SHOULD
- Separate immediate mitigation from permanent corrective action.
## Exceptions
Life-safety or equivalent emergency procedures follow explicitly approved runbooks.
## Verification
Review incident timeline, approvals, evidence, recovery checks, data validation, and follow-up actions.