# Default and Fallback Rules

## Purpose
Ensure applications behave safely when the feature-flag service, network, cache, or configuration is unavailable.

## Scope
Applies to SDK initialization, bootstrap data, cached values, missing flags, evaluation errors, and service outages.

## MUST
- Every flag integration MUST define a safe fallback value or behavior.
- Fallbacks for security, entitlement, destructive action, and payment-sensitive features MUST fail toward the safer state.
- SDK startup behavior MUST be defined for unavailable remote configuration.
- Cached values MUST have explicit freshness and invalidation semantics.
- Applications MUST remain operational when a noncritical flag provider is temporarily unavailable.

## MUST NOT
- MUST NOT treat provider availability as a prerequisite for process startup unless explicitly justified.
- MUST NOT default security-sensitive gates to permissive access because evaluation failed.
- MUST NOT silently substitute an arbitrary variant.

## SHOULD
- Bootstrap configuration SHOULD cover critical flags required during startup.

## Exceptions
Fail-closed behavior that intentionally blocks service requires risk analysis and operational approval.

## Verification
Use outage injection, cold-start tests, missing-key tests, cache-expiry tests, and review of security-sensitive defaults.