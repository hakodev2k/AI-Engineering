# Stream Processing Rules

## Purpose
Protect correctness and availability in continuous data processing where ordering, duplication, lateness, and state recovery are normal operating concerns.

## Scope
Applies to streaming transforms, event pipelines, stateful processors, materialized stream views, and real-time derived data.

## MUST
- Every stream processor MUST define delivery semantics, ordering assumptions, event-time versus processing-time behavior, and duplicate handling.
- Stateful processing MUST define checkpointing, state restoration, and compatibility behavior for state schema changes.
- Late and out-of-order events MUST have an explicit policy including watermark or equivalent completion semantics where applicable.
- Consumer lag, throughput, processing latency, restart frequency, and failed-record rates MUST be observable.
- Repartitioning or key changes that can alter ordering or state locality MUST undergo correctness and capacity review.

## MUST NOT
- MUST NOT describe a pipeline as exactly-once unless end-to-end observable effects satisfy that guarantee.
- MUST NOT assume event arrival order equals business event order without evidence from the source contract.
- MUST NOT let poison messages cause infinite crash-restart loops without isolation and operator visibility.

## SHOULD
- Prefer deterministic transformations and replayable source retention for critical flows.
- SHOULD test behavior under duplicates, reordering, lag, restarts, and consumer rebalances.

## Exceptions
Exceptions require documented delivery trade-offs, expected data impact, recovery method, verification evidence, and owner approval.

## Verification
Use replay tests, fault injection, ordering and duplicate tests, state restore tests, lag metrics, and reconciliation against authoritative source data.