# Indexing and Storage Rules

## Purpose
Keep graph storage layouts and indexes aligned with measured access patterns and operational constraints.

## Scope
Property indexes, text indexes, vector indexes, adjacency storage, partitions, compaction, and physical layout.

## MUST
- Indexes MUST be justified by measured query or write requirements.
- Index creation and removal MUST include expected storage, build-time, and write-amplification impact.
- Large index builds MUST have capacity and rollback plans.
- Storage partitioning MUST account for known skew and hotspot risks.

## MUST NOT
- MUST NOT create redundant indexes without evidence of distinct value.
- MUST NOT rebuild large production indexes without operational safeguards.
- MUST NOT choose partition keys solely from convenient schema fields when access patterns contradict them.

## SHOULD
- Review unused or low-value indexes periodically.
- Prefer online or progressive index operations when supported.

## Exceptions
Emergency index changes require incident context, bounded scope, and post-change validation.

## Verification
Inspect query plans, index usage metrics, build logs, storage growth, and write-latency measurements.