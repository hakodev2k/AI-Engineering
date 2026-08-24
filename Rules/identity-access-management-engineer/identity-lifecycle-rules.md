# Identity Lifecycle Rules

## Purpose
Keep identities and access synchronized with authoritative lifecycle events.

## Scope
Joiner, mover, leaver, contractor, partner, service-account, suspension, reactivation, and termination flows.

## MUST
- Identity creation and status changes MUST originate from an approved authoritative source or controlled exception process.
- Termination and high-risk suspension events MUST revoke relevant access within the defined security SLA.
- Role or organizational changes MUST trigger reevaluation of inherited and direct entitlements.
- Lifecycle automation MUST be idempotent, observable, retry-safe, and reconcile against authoritative state.

## MUST NOT
- MUST NOT leave orphaned accounts active after ownership or employment ends.
- MUST NOT silently ignore provisioning or deprovisioning failures.
- MUST NOT reactivate prior privilege without revalidation.

## SHOULD
- Prefer automated reconciliation and event-driven deprovisioning with periodic full-state checks.

## Exceptions
Manual handling requires ticketed reason, owner, bounded duration, evidence, and post-action reconciliation.

## Verification
Review lifecycle event samples, reconciliation reports, deprovisioning latency, failure queues, and orphan-account scans.