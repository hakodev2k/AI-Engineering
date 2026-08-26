# Production Operations

## Purpose
Operate cache systems safely through routine changes, incidents, and maintenance.

## Scope
Runbooks, maintenance, configuration, emergency actions, and operational ownership.

## MUST
- Production caches MUST have identified ownership, escalation paths, and runbooks for common high-impact failures.
- Operational changes MUST define expected impact, monitoring, abort criteria, and recovery.
- Destructive purges, topology reductions, or production configuration changes with material risk MUST require authorized human approval.
- Emergency actions MUST be recorded with rationale and follow-up verification.

## MUST NOT
- Production commands MUST NOT be executed against an ambiguously identified environment.
- Safety controls MUST NOT be bypassed without explicit authorization and documented risk.
- Incident mitigation MUST NOT be declared successful before user impact and dependency health are verified.

## SHOULD
- Automate repeatable, validated operations with guardrails.
- Periodically rehearse recovery procedures.

## Exceptions
Emergency deviations require bounded authority, evidence, auditability, and retrospective review.

## Verification
Inspect runbooks, access records, change history, incident reports, drills, alerts, and post-change metrics.