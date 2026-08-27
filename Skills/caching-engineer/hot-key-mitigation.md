# Hot-Key Mitigation

## Purpose
Detect and mitigate keys whose disproportionate traffic or compute cost creates shard, node, or origin bottlenecks.

## When to use
Use for uneven cache CPU/network utilization, shard saturation, high tail latency, or celebrity-key traffic.

## Inputs
Per-key/QPS telemetry, shard mapping, object size, access distribution, replication options.

## Context to inspect
Inspect partition algorithm, node utilization, top-key sampling, client routing, and replication behavior.

## Core knowledge
Uniform hashing does not eliminate skew from non-uniform demand. Mitigations include local L1 copies, selective replication, key splitting for aggregatable data, request coalescing, and admission control.

## Procedure
1. Confirm skew with per-key or sampled telemetry.
2. Quantify resource consumption of top keys.
3. Determine whether bottleneck is cache node, network, serialization, or origin.
4. Add local caching or replicas for read-heavy immutable values where safe.
5. Split keys only when semantics permit recombination.
6. Coalesce fills and bound concurrent origin requests.
7. Apply rate limits when demand cannot be served safely.
8. Rebalance shards if structural skew remains.
9. Test failover of replicated hot keys.
10. Monitor skew after mitigation.

## Decision points
Replicate read-heavy values; partition write-heavy aggregations only with explicit merge semantics. Do not blindly add nodes when one key dominates.

## Common failure patterns
Averaged metrics hiding one hot shard; over-replication; mutable replicas with no invalidation; key splitting that breaks atomicity.

## Verification
Compare max-node utilization, p99 latency, and per-key load before and after change.

## Expected output
A root-cause-backed hot-key mitigation with measured skew reduction.

## Stop conditions
Stop if key semantics prevent safe replication/splitting and capacity controls require product-level decisions.