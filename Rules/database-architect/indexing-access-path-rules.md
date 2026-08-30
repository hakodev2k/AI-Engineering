# Indexing and Access Paths

## Purpose
Ensure indexes and access paths are driven by real workload evidence and lifecycle cost.

## Scope
Primary, secondary, covering, partial, composite, search, and specialized indexes.

## MUST
- Index design MUST be based on representative predicates, joins, ordering, cardinality, and write volume.
- Composite index key order MUST reflect supported access patterns.
- Index changes MUST account for storage, write amplification, maintenance, and locking impact.
- Critical query paths MUST be validated with execution plans or equivalent runtime evidence.

## MUST NOT
- MUST NOT add indexes solely from intuition or one isolated slow query.
- MUST NOT retain redundant or unused indexes indefinitely.
- MUST NOT create wide indexes without considering cache pressure and write cost.

## SHOULD
- Index inventories SHOULD be reviewed periodically against production usage.
- Prefer the minimum index set that satisfies required latency and throughput.

## Exceptions
Exceptions require workload evidence, expected benefit, operational risk, and rollback plan.

## Verification
Inspect execution plans, index-usage statistics, write latency, storage growth, and benchmark results.