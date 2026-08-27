# Provisioning and Reconciliation
## Purpose
Make account and entitlement propagation reliable and detectable.
## Scope
Provisioning connectors, SCIM, synchronization, and reconciliation jobs.
## MUST
- Provisioning MUST be idempotent or otherwise protect against duplicate effects.
- Failed creates, updates, and revocations MUST be retried safely and surfaced when the recovery budget is exceeded.
- Reconciliation MUST detect drift between authoritative intent and target state.
## MUST NOT
- Provisioning errors MUST NOT silently grant broader access.
- Retry logic MUST NOT create duplicate identities or entitlements.
## SHOULD
- Use correlation identifiers and deterministic mappings.
## Exceptions
Document target limitations and compensating reconciliation controls.
## Verification
Run integration tests, failure injection, reconciliation reports, and target-state inspection.