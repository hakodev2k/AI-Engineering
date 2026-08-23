# Identity Lifecycle Rules

## Purpose
Control identities from authoritative creation through disablement and deletion.

## Scope
Workforce, partner, service, and machine identities managed by IAM systems.

## MUST
- Identity creation MUST originate from an approved authoritative source or documented owner.
- Joiner, mover, and leaver events MUST have deterministic provisioning and deprovisioning behavior.
- Privileges MUST be recalculated when employment, ownership, or trust context changes.
- Disablement of terminated or compromised identities MUST meet the defined revocation SLA.
- Orphaned identities MUST be detected through recurring reconciliation.

## MUST NOT
- MUST NOT retain access solely because deprovisioning is operationally inconvenient.
- MUST NOT reuse identity identifiers in ways that can inherit prior entitlements.
- MUST NOT treat application deletion as proof that downstream access was revoked.

## SHOULD
- Lifecycle flows SHOULD be automated, idempotent, observable, and reversible where practical.
- Exceptions SHOULD expire automatically.

## Exceptions
Exceptions require owner, business reason, risk assessment, expiry, compensating controls, and approval proportional to privilege.

## Verification
Inspect authoritative-source mappings, provisioning logs, reconciliation reports, termination samples, orphan reports, and revocation-latency evidence.