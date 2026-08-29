# Idempotency and Deduplication Rules

## Purpose
Prevent duplicate processing from creating duplicate business effects or corrupting state.

## Scope
Applies to retried requests, message consumption, webhook delivery, batch replay, and recovery processing.

## MUST
- Operations that may be delivered or invoked more than once MUST define their idempotency strategy.
- Deduplication keys MUST be stable for the intended business operation and have documented retention behavior.
- Idempotency state MUST be persisted when process-local memory cannot survive retries or failover.
- Duplicate detection MUST return or preserve a semantically consistent outcome.

## MUST NOT
- MUST NOT assume transport-level retry suppression guarantees business-level exactly-once effects.
- MUST NOT use timestamps alone as deduplication identity when legitimate repeated events can share timing windows.
- MUST NOT expire deduplication state before the documented replay or retry horizon without risk analysis.

## SHOULD
- Idempotency SHOULD be implemented at the boundary closest to the irreversible business effect.
- Deduplication behavior SHOULD be observable.

## Exceptions
Document why duplicates are acceptable, bounded impact, compensating controls, and approval.

## Verification
Run duplicate-request, replay, retry-after-timeout, and failover tests; inspect persistence and business records for single-effect behavior.