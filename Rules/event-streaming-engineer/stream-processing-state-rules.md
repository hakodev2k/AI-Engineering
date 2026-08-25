# Stream Processing State Rules

## Purpose
Keep stateful processors correct and recoverable across crashes, rebalances, scaling, and topology changes.

## Scope
Applies to local/remote state stores, checkpoints, changelogs, joins, aggregations, and materialized views.

## MUST
- Stateful topology MUST define state ownership, durability, restoration source, and consistency expectations.
- Checkpoint/state-store configuration MUST be compatible with the required delivery semantics.
- State schema changes MUST include migration or rebuild strategy before deployment.
- Join and aggregation state MUST have explicit retention based on event-time semantics and late-data requirements.
- Restoration time and storage growth MUST be capacity-tested for credible failure scenarios.

## MUST NOT
- MUST NOT treat ephemeral local state as authoritative without a durable restoration mechanism.
- MUST NOT delete changelogs/checkpoints for production processors without approval and recovery analysis.
- MUST NOT change topology identifiers in ways that orphan state unintentionally.
- MUST NOT allow state growth to remain unbounded without a justified retention model.

## SHOULD
- State stores SHOULD expose size, restore duration, cache effectiveness, and failure metrics.
- Rebuildable derived state SHOULD have a tested rebuild procedure.

## Exceptions
State reset requires explicit data-loss/recomputation analysis, downstream reconciliation, rollback limits, and human approval.

## Verification
Use restart/rebalance tests, state restoration drills, topology diff review, storage metrics, migration tests, and output reconciliation.