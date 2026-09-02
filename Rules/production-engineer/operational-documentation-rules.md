# Operational Documentation Rules

## Purpose
Ensure production knowledge is usable during routine operations and high-pressure incidents.

## Scope
Applies to runbooks, service ownership records, dependency maps, recovery procedures, escalation guides, and operational decision records.

## MUST
- Critical services MUST have current documentation for ownership, architecture boundaries, dependencies, common failure modes, dashboards, alerts, deployment, rollback or recovery, and escalation.
- Runbook procedures MUST identify prerequisites, expected outcomes, failure conditions, and verification steps.
- Material operational changes MUST update affected documentation as part of the change.
- Documentation for emergency procedures MUST be accessible when primary systems or identity paths are degraded.

## MUST NOT
- MUST NOT rely exclusively on personal memory or undocumented chat history for critical procedures.
- MUST NOT retain instructions known to be unsafe or obsolete without clearly marking and replacing them.
- MUST NOT document credentials or secret values in runbooks.

## SHOULD
- Prefer concise procedures linked to deeper architectural context.
- Exercise critical runbooks during drills or representative maintenance.

## Exceptions
Temporary documentation gaps require an owner, risk statement, compensating support path, and committed remediation.

## Verification
Review runbooks against deployed behavior, execute selected procedures in safe environments, inspect ownership records, and verify links and escalation paths.
