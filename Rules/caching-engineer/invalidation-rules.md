# Cache Invalidation

## Purpose
Ensure mutations do not leave consumers with uncontrolled stale state.

## Scope
Explicit invalidation, event-driven eviction, versioning, purge, and refresh mechanisms.

## MUST
- Mutable cached data MUST have an invalidation strategy whose failure behavior is defined.
- Invalidation triggered by writes MUST account for transaction ordering and partial failure.
- Cross-service invalidation MUST use owned, observable contracts rather than undocumented side effects.
- Critical invalidation paths MUST be idempotent or safely repeatable.

## MUST NOT
- A successful authoritative write MUST NOT be reported as fully propagated when required invalidation has silently failed.
- Wildcard or global purges MUST NOT be executed in production without impact assessment and authorization when they can cause material load.
- Invalidation events MUST NOT be assumed exactly-once unless the transport and consumer semantics prove it.

## SHOULD
- Prefer namespace/version techniques when precise invalidation is operationally fragile.
- Reconciliation SHOULD exist for missed invalidation where stale state has material impact.

## Exceptions
Document consistency tolerance, failure detection, reconciliation, risk, and approval.

## Verification
Use integration tests, failure injection, event replay tests, propagation-latency metrics, audit logs, and production traces.