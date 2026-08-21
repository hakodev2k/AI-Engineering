# Query Performance Rules
## Purpose
Ensure analytical and transformation workloads use resources efficiently without sacrificing correctness.
## Scope
SQL, distributed queries, joins, scans, aggregations, and serving workloads.
## MUST
- Performance claims MUST use representative before/after measurements.
- Expensive queries MUST be analyzed with execution plans, scan metrics, or engine evidence.
- Join keys, filters, partition pruning, and data volume MUST be considered for critical workloads.
## MUST NOT
- MUST NOT optimize from intuition alone when runtime evidence is available.
- MUST NOT trade correctness for speed without explicit approval.
## SHOULD
- Prefer reducing scanned data and unnecessary shuffles before adding compute.
## Exceptions
Estimated analysis is acceptable when production-scale evidence is unavailable, with assumptions documented.
## Verification
Inspect plans, profiles, bytes scanned, shuffle metrics, runtimes, and benchmarks.