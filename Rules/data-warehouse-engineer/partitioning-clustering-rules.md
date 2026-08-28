# Partitioning and Clustering Rules

## Purpose
Use physical data layout deliberately to improve warehouse performance and cost efficiency.

## Scope
Applies to partitioning, clustering, sorting, distribution, sharding, and pruning strategies.

## MUST
- Physical layout decisions MUST be based on measured workload patterns, data volume, and pruning behavior.
- Partition keys MUST avoid pathological skew and uncontrolled small-partition growth.
- Changes to clustering or distribution MUST evaluate query performance, maintenance cost, and write amplification.
- Large-table redesigns MUST include rollback or recovery planning.

## MUST NOT
- MUST NOT partition solely because a column is commonly filtered without validating cardinality and pruning benefit.
- MUST NOT claim improvement without before/after evidence.

## SHOULD
- Prefer layouts that benefit multiple important workloads over one narrow query unless that query is business-critical.
- Reassess layout as access patterns materially change.

## Exceptions
Specialized layouts require benchmark evidence and documented operational trade-offs.

## Verification
Inspect query plans, scan bytes, partition statistics, skew metrics, maintenance history, and benchmarks.