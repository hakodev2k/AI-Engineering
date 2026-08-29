# Indexing Rules

## Purpose
Use indexes deliberately to improve graph access without unnecessary write, memory, or storage cost.

## Scope
Lookup, range, text, vector, composite, and platform-specific indexes.

## MUST
- Tie each production index to a documented query or integrity requirement.
- Validate index selectivity and actual planner usage for critical queries.
- Account for index build time, write amplification, memory, disk, and replication impact before rollout.
- Monitor online index creation until it reaches the expected state.

## MUST NOT
- Add indexes solely because a property is frequently present.
- Assume an index improves traversal performance without plan evidence.
- Drop an index used by production workloads without dependency analysis and rollback planning.

## SHOULD
- Remove redundant indexes after confirming no required workload depends on them.
- Prefer the narrowest index that satisfies the access pattern.

## Exceptions
Speculative indexes for controlled experiments require a removal criterion and bounded test period.

## Verification
Compare execution plans and before/after latency, throughput, write cost, storage, and cache behavior. Inspect deployed index metadata and workload telemetry rather than relying on configuration intent.