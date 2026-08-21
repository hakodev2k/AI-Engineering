# Partitioning and Sharding Rules
## Purpose
Scale large datasets without introducing avoidable operational or consistency complexity.
## Scope
Table partitioning, horizontal sharding, routing keys, rebalancing, and cross-shard operations.
## MUST
- Justify partitioning or sharding with measured scale constraints and documented access patterns.
- Choose keys using distribution, locality, growth, hotspot, and lifecycle evidence.
- Define rebalancing, failure, backup, and cross-boundary query behavior before production adoption.
## MUST NOT
- Introduce sharding solely as a speculative future-proofing measure.
- Use a key known to create severe hotspots without a mitigation plan.
## SHOULD
- Prefer simpler single-database scaling while it meets verified requirements.
## Exceptions
Specialized regulatory or isolation requirements may justify earlier partitioning with documented rationale.
## Verification
Review distributions, load tests, routing tests, hotspot metrics, recovery procedures, and rebalancing drills.