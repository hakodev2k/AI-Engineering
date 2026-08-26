# Offline and Synchronization Security Rules

## Purpose
Preserve authorization and data integrity when mobile applications operate offline and later reconcile state.

## Scope
Offline caches, queued writes, local mutations, synchronization, conflict resolution, and delayed authorization.

## MUST
- Define which operations are safe offline and which require online authoritative validation.
- Protect queued sensitive operations and data according to their classification.
- Revalidate authorization, freshness, and invariants when offline operations synchronize.
- Define deterministic conflict and replay handling for security-relevant state.

## MUST NOT
- Treat stale cached entitlements as indefinitely valid authority.
- Allow offline mode to bypass limits that are security or fraud controls without an explicit bounded design.
- Assume synchronization occurs exactly once.

## SHOULD
- Make queued operations idempotent and include stable operation identifiers where practical.
- Bound offline authorization by time, scope, value, or risk.

## Exceptions
Offline privileged behavior requires explicit limits, reconciliation rules, abuse analysis, compensating controls, and approval.

## Verification
Test stale credentials, revoked access, duplicate synchronization, conflicting changes, clock shifts, long offline periods, and interrupted reconciliation.