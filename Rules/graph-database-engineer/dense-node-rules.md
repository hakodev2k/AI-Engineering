# Dense Node and Supernode Rules

## Purpose
Prevent high-degree entities from creating pathological traversal, locking, storage, or operational behavior.

## Scope
Hubs, supernodes, high-degree vertices, fan-out/fan-in patterns, and skewed graph topology.

## MUST
- Measure degree distributions for relationship types used in critical traversals.
- Identify and test worst-case high-degree entities, not only median cases.
- Bound or filter traversals through dense nodes according to business semantics.
- Evaluate contention and write amplification when many writers update the same graph region.

## MUST NOT
- Assume uniform graph degree when sizing or benchmarking.
- Introduce synthetic hub nodes solely to simplify modeling without measuring traversal consequences.
- Enumerate all neighbors of unbounded supernodes on synchronous critical paths without explicit controls.

## SHOULD
- Consider partitioning semantics, precomputed projections, selective relationships, or alternate query paths where justified by evidence.

## Exceptions
Intentional hub models require documented maximum expected degree, workload evidence, resource limits, and degradation strategy.

## Verification
Analyze degree histograms, query profiles, tail latency, lock/contention metrics, memory behavior, and worst-case load tests using production-representative hubs.