# Partitioning and Key Rules

## Purpose
Preserve required ordering while distributing load safely.

## Scope
Applies to stream keys, partition counts, routing strategies, hot-key risk, and repartitioning.

## MUST
- Partition keys MUST be chosen from explicit ordering, affinity, distribution, and consumer-state requirements.
- Key cardinality and skew MUST be measured with representative production-like data before high-scale adoption.
- Any ordering guarantee MUST state its boundary, normally per partition or per key.
- Partition-count changes MUST evaluate consumer parallelism, key remapping, state stores, and ordering effects.
- Null-key behavior MUST be deliberate and tested.

## MUST NOT
- MUST NOT promise global ordering when the platform provides only partition-local ordering.
- MUST NOT use low-cardinality or monotonically concentrated keys without evaluating hotspot risk.
- MUST NOT change key derivation silently for an established stream.
- MUST NOT increase partitions on stateful workloads without checking framework-specific repartition consequences.

## SHOULD
- Stable business identifiers SHOULD be preferred when they align with ordering and affinity needs.
- Distribution SHOULD be monitored for hot partitions and lag concentration.
- Repartitioning SHOULD be isolated behind explicit topology stages when semantics change.

## Exceptions
A deliberately skewed key requires documented rationale, capacity evidence, mitigation, operational thresholds, and owner approval.

## Verification
Inspect key-generation code, sample key distributions, partition utilization, lag by partition, load tests, and topology tests covering ordering and repartition scenarios.