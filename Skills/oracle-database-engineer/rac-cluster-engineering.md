# RAC Cluster Engineering

## Purpose
Design and troubleshoot Oracle RAC for workloads that genuinely require clustered availability or scale, while controlling interconnect and global-cache overhead.

## When to use
Use for RAC architecture, instance imbalance, gc waits, node eviction, service placement, or scaling reviews.

## Inputs
Workload distribution, availability targets, node topology, interconnect/storage metrics, services, AWR/ASH by instance.

## Context to inspect
Clusterware, VIP/SCAN, services, affinity, cache-fusion waits, interconnect latency/loss, hot blocks, instance recovery, voting/OCR, and storage consistency.

## Core knowledge
RAC is shared-database clustering, not free horizontal scaling. Block ownership and cross-instance traffic can make poorly partitioned workloads slower than single instance.

## Procedure
1. Confirm the requirement RAC is solving.
2. Map services and workloads to instances.
3. Compare per-instance CPU, I/O, sessions, and waits.
4. Inspect gc current/cr block waits and hot-object patterns.
5. Validate private interconnect latency and packet loss.
6. Review sequence, index, and hot-block designs.
7. Configure service failover and preferred/available instances deliberately.
8. Test node loss, service relocation, and instance recovery.
9. Tune application affinity only when evidence shows benefit.
10. Reassess whether complexity is justified by achieved availability/scale.

## Decision points
Use service-based workload partitioning when it reduces cross-instance traffic. Scale up or simplify when RAC coordination dominates workload value.

## Common failure patterns
Round-robin all workloads, ignoring gc waits, weak interconnect design, and assuming node count linearly increases throughput.

## Verification
Run load and node-failure tests; compare throughput, gc waits, recovery time, and service behavior.

## Expected output
A measured RAC topology and workload-placement strategy.

## Stop conditions
Stop when cluster/storage prerequisites are unstable or RAC adds complexity without demonstrated requirement.