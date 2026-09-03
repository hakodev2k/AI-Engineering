# Event Ordering

## Purpose
Design ordering guarantees only where business correctness requires them.

## When to use
Use for partitioned streams, concurrent producers, stateful consumers, and race-condition investigations.

## Inputs
Business invariants, event keys, broker ordering model, producer topology, consumer concurrency.

## Context to inspect
Partition strategy, keys, retries, batching, producer sequence, consumer parallelism, and rebalancing.

## Core knowledge
Global ordering is expensive and rarely necessary. Per-aggregate or per-key ordering is usually sufficient. Retries and multiple producers can reorder observations even when a broker preserves partition order.

## Procedure
1. Identify exact invariants affected by order.
2. Determine the smallest ordering scope.
3. Choose a stable partition key matching that scope.
4. Ensure authoritative writes produce monotonic version or sequence metadata where needed.
5. Configure producer and consumer concurrency consistently.
6. Define behavior for gaps, stale events, and duplicates.
7. Avoid cross-partition joins that assume temporal alignment.
8. Test retry, rebalance, and delayed-event scenarios.

## Decision points
Prefer commutative/idempotent state updates over stronger ordering. Use sequence checks when stale events must be rejected. Serialize only the entities that require serialization.

## Common failure patterns
Demanding global order, partitioning randomly, changing keys midstream, assuming timestamp order equals causal order, and blocking indefinitely on missing sequence numbers.

## Verification
Concurrency tests preserve business invariants under delayed, duplicate, and reordered delivery; partition distribution remains healthy.

## Expected output
An explicit ordering model with partition keys, sequence handling, and tested consumer behavior.

## Stop conditions
Stop when ordering requirements conflict with required throughput or causal ownership is undefined.