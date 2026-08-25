# Consumer Group Rules

## Purpose
Keep consumer parallelism, ownership, and recovery predictable under scaling and failure.

## Scope
Applies to group identity, subscriptions, rebalances, assignment, offsets, and concurrency.

## MUST
- Consumer group identifiers MUST represent a stable logical consumption purpose rather than ephemeral deployment instances.
- Consumer concurrency MUST respect partition count, processing capacity, downstream limits, and ordering requirements.
- Rebalance handling MUST safely stop or complete in-flight work before partition ownership is lost where required by the processing guarantee.
- Offset reset policy and behavior for missing/out-of-range offsets MUST be explicit.
- Group lag and rebalance frequency MUST be observable.

## MUST NOT
- MUST NOT share a consumer group between workloads that require independent delivery.
- MUST NOT increase consumer concurrency without considering downstream saturation and rebalance behavior.
- MUST NOT reset production offsets or group identity without human approval and an impact plan.
- MUST NOT assume a healthy process implies healthy partition assignment.

## SHOULD
- Static membership or cooperative rebalancing SHOULD be considered where churn materially harms availability.
- Processing time SHOULD remain safely within platform liveness/session constraints.

## Exceptions
Temporary offset intervention requires documented target offsets, affected partitions, replay/loss implications, rollback limits, and approval.

## Verification
Inspect group configuration, assignment telemetry, lag by partition, rebalance logs, scale tests, and controlled consumer-failure tests.