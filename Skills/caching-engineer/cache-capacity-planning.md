# Cache Capacity Planning

## Purpose
Size cache clusters for working set, traffic, failover, growth, and cost with explicit headroom.

## When to use
Use for new deployments, scaling, budget planning, or resource-exhaustion risk.

## Inputs
QPS, object-size distribution, working set, growth forecast, replication factor, node limits, SLO.

## Context to inspect
Inspect memory residency, fragmentation, CPU, bandwidth, connection counts, eviction trends, failover topology, and pricing.

## Core knowledge
Capacity is multidimensional: memory, CPU, network, operations, connections, and hot-shard limits. N+1 failover and maintenance states often define required headroom more strongly than steady state.

## Procedure
1. Measure current and forecast request volume.
2. Estimate active working-set bytes including metadata and fragmentation.
3. Apply replication overhead.
4. Model peak CPU/network/operations and connection demand.
5. Reserve failover and maintenance headroom.
6. Model hot-key/skew effects.
7. Calculate node count across each limiting dimension.
8. Validate with load testing.
9. Define scale triggers and lead time.
10. Compare architectures on cost and operational risk.

## Decision points
Scale up when single-node efficiency and simplicity dominate; scale out for capacity, fault domains, or bandwidth. Add nodes only if partitioning can distribute the limiting load.

## Common failure patterns
Memory-only sizing; average traffic; no replication cost; no N+1; ignoring fragmentation and network; linear growth assumptions without evidence.

## Verification
Run projected peak and node-loss tests and confirm SLO plus headroom.

## Expected output
A capacity model with scale thresholds and cost estimate.

## Stop conditions
Stop if workload or backend limits are unknown enough to make sizing speculative.