# Flag Lifecycle Rules

## Purpose
Control feature flags from proposal through retirement so temporary controls do not become permanent operational debt.

## Scope
All runtime, release, experiment, entitlement, and operational flags.

## MUST
- Every flag MUST have an owner, purpose, creation date, intended states, and retirement condition.
- Every temporary flag MUST have an expiry or review date.
- Retirement MUST remove dead branches, obsolete configuration, tests that only protect retired behavior, and unused telemetry.
- Long-lived flags MUST be explicitly classified and periodically revalidated.

## MUST NOT
- Flags MUST NOT remain ownerless.
- A flag MUST NOT be considered complete merely because rollout reached 100%.
- Temporary flags MUST NOT silently become permanent architecture.

## SHOULD
- Lifecycle metadata SHOULD be machine-queryable.
- Cleanup SHOULD be part of the original delivery plan.

## Exceptions
Exceptions require documented reason, risk, owner, next review date, and approval for materially extended lifetime.

## Verification
Inspect flag registry metadata, repository references, configuration stores, cleanup pull requests, and automated stale-flag reports.