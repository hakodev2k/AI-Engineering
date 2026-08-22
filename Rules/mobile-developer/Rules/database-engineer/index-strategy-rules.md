# Index Strategy Rules
## Purpose
Provide predictable query performance without excessive write or storage cost.
## Scope
Relational indexes, clustered layouts, covering indexes, filtered indexes, and maintenance.
## MUST
- Base new indexes on observed query patterns, selectivity, execution plans, and workload evidence.
- Evaluate write amplification, storage, maintenance, and overlap before adding an index.
- Revalidate important plans after material index changes.
## MUST NOT
- Add indexes solely because a column appears in a predicate.
- remove an index without checking dependent workloads and production evidence.
## SHOULD
- Consolidate redundant indexes when evidence shows equivalent coverage.
## Exceptions
Emergency mitigations require documented evidence and follow-up review.
## Verification
Use execution plans, runtime metrics, index usage statistics, write benchmarks, and before/after measurements.