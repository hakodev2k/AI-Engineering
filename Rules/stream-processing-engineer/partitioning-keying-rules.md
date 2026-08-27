# Partitioning and Keying
## Purpose
Preserve correctness and scalable load distribution.
## Scope
Partition keys, repartitioning, ordering, and affinity.
## MUST
- Partition keys MUST align with required ordering and state-locality invariants.
- Key cardinality and skew MUST be measured using production-representative distributions.
- Repartitioning changes MUST assess ordering, state migration, throughput, and downstream compatibility.
## MUST NOT
- A low-cardinality or hotspot-prone key MUST NOT be adopted without mitigation.
## SHOULD
- Key design SHOULD remain stable across compatible producer versions.
## Exceptions
Intentional skew requires documented capacity controls and monitoring.
## Verification
Analyze partition distribution, hotspot metrics, ordering tests, and state placement under representative load.