# Index Design Rules
## Purpose
Balance query latency against write, storage, and maintenance cost.
## Scope
B-tree, hash, GiST, SP-GiST, GIN, BRIN, partial, expression, and covering indexes.
## MUST
- Justify new indexes with workload evidence and representative query plans.
- Evaluate selectivity, ordering, write amplification, storage, and duplicate-index overlap.
- Verify index usage after deployment.
## MUST NOT
- Add indexes solely because a column appears in a predicate.
- Drop an index without checking constraints, production workload, and dependent queries.
## SHOULD
- Prefer the smallest index that satisfies demonstrated access patterns.
## Exceptions
Preventive indexes for known imminent workloads require documented assumptions and later validation.
## Verification
Use EXPLAIN (ANALYZE where safe), pg_stat views, index sizes, write metrics, and duplicate-index analysis.