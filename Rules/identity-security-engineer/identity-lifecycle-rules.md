# Identity Lifecycle Rules

## Purpose
Control identity creation, modification, suspension, and deletion so access follows authoritative business state.

## Scope
Applies to workforce, customer, contractor, machine, and service identities.

## MUST
- Every identity MUST have an authoritative source or accountable owner.
- Joiner, mover, and leaver events MUST trigger timely access reevaluation.
- Disabled or terminated identities MUST lose active access within the approved revocation objective.
- Identity state changes MUST be auditable and attributable.
- Orphaned identities MUST be detectable through periodic reconciliation.

## MUST NOT
- Access MUST NOT persist indefinitely after ownership or employment context ends.
- Dormant identities MUST NOT remain privileged without explicit documented justification.
- Identity records MUST NOT be deleted when retention requirements require preserved audit evidence.

## SHOULD
- Lifecycle actions SHOULD be automated from authoritative sources where controls and reconciliation exist.
- Temporary identities SHOULD have explicit expiration.

## Exceptions
Exceptions require owner, duration, risk, compensating controls, and review date.

## Verification
Inspect provisioning logs, reconciliation reports, termination samples, orphan reports, and periodic lifecycle-control tests.