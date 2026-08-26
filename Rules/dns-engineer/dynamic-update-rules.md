# Dynamic Update Rules

## Purpose
Control automated DNS mutations without sacrificing integrity.

## Scope
RFC-style dynamic updates, API-driven record changes, and automation identities.

## MUST
- Dynamic update identities MUST be scoped to the minimum zones, names, and record types required.
- Automated updates MUST be authenticated, logged, retry-safe, and observable.
- Automation MUST validate intended state before destructive replacement or deletion.

## MUST NOT
- MUST NOT grant broad zone-write privileges to workloads needing only narrow record updates.
- MUST NOT silently retry non-idempotent mutations without state verification.

## SHOULD
- Update automation SHOULD expose reconciliation and drift detection.

## Exceptions
Broader privileges require documented necessity, compensating controls, and approval.

## Verification
Inspect update policy, credentials scope, audit events, failure tests, and reconciliation output.