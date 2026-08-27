# Index Maintenance

## Purpose
Keep indexing aligned with real workload while controlling write, storage, and maintenance cost.

## Scope
Index creation, removal, rebuild/reorganization, statistics dependencies, and index health.

## MUST
- Index changes MUST be justified by workload evidence and evaluated for read benefit, write cost, storage, locking, and maintenance impact.
- Removal of an index MUST consider all material workloads and constraint dependencies.
- Online versus blocking maintenance behavior MUST be understood before production execution.
- Large maintenance operations MUST be bounded by resource and operational safeguards.

## MUST NOT
- MUST NOT create indexes solely from generic recommendations without validating workload relevance.
- MUST NOT rebuild every index on a fixed schedule regardless of need and operational cost.
- MUST NOT drop constraint-supporting or critical indexes without dependency review and approval.

## SHOULD
- Duplicate and overlapping indexes SHOULD be consolidated when evidence supports it.
- Maintenance SHOULD be scheduled from measured need rather than folklore.

## Exceptions
Urgent index mitigation requires captured evidence, rollback/removal plan, and post-change validation.

## Verification
Inspect index usage, execution plans, write overhead, storage growth, maintenance history, lock impact, and before/after query metrics.