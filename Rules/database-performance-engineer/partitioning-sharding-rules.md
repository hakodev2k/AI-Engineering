# Partitioning and Sharding Rules
## Purpose
Apply data distribution only when its operational complexity is justified by measurable scale needs.
## Scope
Table partitioning, horizontal sharding, routing, and data placement.
## MUST
- Define the scaling constraint, partition key, distribution behavior, rebalance strategy, and failure model before adoption.
- Test pruning or routing effectiveness with representative queries and skew.
- Document cross-partition transaction and query implications.
## MUST NOT
- Introduce sharding as a speculative future-proofing measure without demonstrated need.
- Use a partition key that creates known hot partitions without mitigation.
## SHOULD
- Prefer reversible or incrementally adoptable distribution designs.
## Exceptions
Regulatory or tenancy isolation may justify partitioning independent of raw performance.
## Verification
Review distribution metrics, key cardinality, skew tests, query plans, rebalance procedures, and operational runbooks.