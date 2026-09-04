# Incident Recovery Rules

## Purpose
Provide controlled containment, reconciliation, and restoration when an agent causes or contributes to a production incident.

## Scope
Applies to harmful or uncertain agent actions, runaway workflows, duplicated side effects, corrupted state, compromised dependencies, and reliability incidents involving autonomous execution.

## MUST
- Incident handling MUST preserve available evidence before destructive cleanup when doing so does not increase ongoing harm.
- Systems with consequential autonomous actions MUST provide a mechanism to stop or disable affected execution paths promptly.
- Recovery MUST identify affected runs, users, tenants, resources, and external operations to the extent supported by evidence.
- Uncertain external outcomes MUST be reconciled against authoritative systems before deciding whether to retry, compensate, or close the incident.
- Reversible harmful changes MUST be rolled back or compensated according to an approved recovery plan.
- Restoration of autonomous execution MUST require evidence that the triggering failure is contained and critical safety controls are functioning.
- Material incidents MUST produce regression tests, monitoring improvements, or documented corrective actions appropriate to the root cause.

## MUST NOT
- Autonomous execution MUST NOT resume solely because a failed dependency has recovered.
- Incident evidence MUST NOT be deleted or overwritten merely to restore normal operation.
- Compensation MUST NOT be assumed successful without verification from the affected system.
- Root cause MUST NOT be invented when evidence only supports a bounded hypothesis.

## SHOULD
- Critical workflows SHOULD have documented recovery runbooks and periodic incident drills.
- Recovery decisions SHOULD favor reversible containment before broad corrective changes when evidence remains incomplete.

## Exceptions
Deviation from normal recovery controls requires documented incident urgency, explicit authority, bounded scope, risk assessment, and retrospective review.

## Verification
Exercise kill switches, reconcile simulated uncertain transactions, test rollback and compensation, run incident drills, and inspect post-incident evidence linking corrective actions to observed failure modes.