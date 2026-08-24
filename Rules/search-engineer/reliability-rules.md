# Search Reliability

## Purpose
Keep search usable under dependency failure, overload, and partial infrastructure loss.

## Scope
Timeouts, retries, degradation, redundancy, overload protection, and recovery.

## MUST
- Set explicit timeouts for remote search dependencies and bound total request budgets.
- Retry only operations and failures known to be safe, with backoff and bounded attempts.
- Define degraded behavior for optional retrieval, enrichment, or reranking dependencies.
- Protect clusters with admission control, concurrency limits, or equivalent overload mechanisms.

## MUST NOT
- Create retry storms.
- Let optional features consume the entire user-facing latency budget.
- claim high availability without tested failure and recovery evidence.

## SHOULD
- Prefer partial but safe results over total failure when product semantics allow it.
- Exercise dependency and capacity failures regularly.

## Exceptions
Exceptions require failure-mode analysis, blast radius, monitoring, and approval for SLO risk.

## Verification
Use resilience tests, timeout/retry configuration review, overload tests, failover exercises, and SLO evidence.