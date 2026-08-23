# Identity Lifecycle Governance

## Purpose
Engineer joiner, mover, leaver, rehire, contractor, and non-human identity lifecycles so access follows authoritative business state.

## When to use
Use when provisioning, deprovisioning, role changes, or stale accounts create operational or security risk.

## Inputs
Authoritative sources, identity attributes, employment states, application entitlements, SLAs, exception rules.

## Context to inspect
HR feeds, directories, provisioning connectors, application account models, disabled-account behavior, audit evidence, reconciliation jobs.

## Core knowledge
Lifecycle controls require authoritative triggers, deterministic mappings, reconciliation, idempotency, and explicit exception ownership. Deactivation speed matters more than nominal provisioning completeness during termination.

## Procedure
1. Define lifecycle states and authoritative events.
2. Map each state transition to account and entitlement actions.
3. Separate birthright from request-based access.
4. Make provisioning idempotent and replay-safe.
5. Define deprovisioning SLAs and emergency termination paths.
6. Reconcile desired versus actual state.
7. Detect orphaned, dormant, and duplicate identities.
8. Record exceptions with owners and expiry.
9. Test retries, partial failures, and source outages.
10. Measure lifecycle latency and stale-access exposure.

## Decision points
Use event-driven propagation for speed where reliable; use scheduled reconciliation as a compensating control.

## Common failure patterns
Email address as immutable key, missing rehire logic, disable without session revocation, manual exceptions with no expiry, and failed connector jobs that silently accumulate drift.

## Verification
Prove representative lifecycle transitions in staging and inspect resulting accounts, entitlements, sessions, and audit records.

## Expected output
Lifecycle state model, mappings, SLAs, reconciliation controls, exception policy, and evidence plan.

## Stop conditions
Escalate if authoritative status is ambiguous, destructive deprovisioning could lose required records, or a critical target cannot revoke access reliably.