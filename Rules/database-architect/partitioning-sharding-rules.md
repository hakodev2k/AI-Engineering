# Partitioning and Sharding

## Purpose
Control scale-out complexity while preserving correctness and operability.

## Scope
Table partitioning, horizontal sharding, tenant placement, routing, rebalancing, and shard-key design.

## MUST
- Partition or shard keys MUST be selected from measurable distribution, locality, growth, and query patterns.
- The design MUST define routing, rebalancing, hotspot handling, and cross-partition query behavior.
- Resharding MUST have a tested migration and rollback strategy before production execution.
- Global uniqueness and cross-shard invariants MUST have explicit mechanisms.

## MUST NOT
- MUST NOT shard preemptively without demonstrated scale or isolation requirements.
- MUST NOT choose monotonically hot keys when they create concentrated write pressure.
- MUST NOT hide cross-shard consistency limitations from consumers.

## SHOULD
- Prefer native partitioning before application-level sharding when it satisfies requirements.
- Tenant isolation SHOULD be considered in placement design.

## Exceptions
Exceptions require quantitative evidence, risk analysis, migration plan, and approval.

## Verification
Review key distributions, routing tests, load tests, rebalance drills, and failure-mode exercises.