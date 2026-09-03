# Feature Flag Lifecycle Rules

## Purpose
Ensure every feature flag has a controlled creation, operation, and retirement lifecycle.

## Scope
Applies to release flags, experiment flags, permission flags, operational kill switches, and configuration-style flags.

## MUST
- Every flag MUST have a documented owner, purpose, creation date, expected lifetime, and retirement condition.
- Every flag MUST declare whether it is temporary or permanent at creation time.
- Temporary flags MUST have a target removal date or measurable exit criterion.
- Flag state transitions MUST be traceable to an authenticated actor or automated process.
- Retirement MUST remove dead branches, stale metadata, and unused targeting rules after verification.

## MUST NOT
- MUST NOT create ownerless or purpose-less flags.
- MUST NOT leave temporary flags indefinitely after rollout completes.
- MUST NOT reuse an old flag identifier for unrelated behavior.

## SHOULD
- Teams SHOULD review stale flags on a recurring basis.
- Flag metadata SHOULD be machine-queryable for governance checks.

## Exceptions
Long-lived flags require documented justification, ownership, and periodic review.

## Verification
Inspect flag metadata, audit history, source references, stale-flag reports, and removal pull requests.