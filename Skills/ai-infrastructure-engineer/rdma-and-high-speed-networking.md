# RDMA and High-Speed Networking

## Purpose
Engineer and troubleshoot high-bandwidth, low-latency network paths for distributed AI workloads.

## When to use
Use for multi-node training, distributed inference, collective communication bottlenecks, or unexplained scaling loss.

## Inputs
Network topology, NIC/GPU mapping, link speeds, RDMA configuration, collective benchmarks, packet/error metrics.

## Context to inspect
RoCE/InfiniBand settings, MTU, congestion control, ECN/PFC where applicable, NUMA locality, NIC bonding, routing, firewall policy, and library versions.

## Core knowledge
Distributed AI performance depends on topology, effective bandwidth, latency, congestion, NIC/GPU locality, and transport configuration. Silent fallback to TCP can materially change performance.

## Procedure
1. Map physical and logical network topology.
2. Confirm NIC, GPU, PCIe, and NUMA locality.
3. Verify RDMA capability and transport actually in use.
4. Run point-to-point and collective benchmarks.
5. Inspect drops, retries, congestion, pause behavior, and link imbalance.
6. Validate MTU and routing consistency end-to-end.
7. Compare performance across racks and failure domains.
8. Test under concurrent cluster load, not only isolated links.
9. Document known-good versions and configuration.

## Decision points
Prefer RDMA when communication volume justifies complexity. Use topology-aware placement when cross-fabric bandwidth differs materially.

## Common failure patterns
TCP fallback, MTU mismatch, wrong NIC affinity, oversubscribed uplinks, asymmetric routing, and tuning congestion controls without evidence.

## Verification
Validate effective bandwidth, collective scaling, packet health, and training throughput under contention.

## Expected output
A verified high-speed network configuration and troubleshooting baseline.

## Stop conditions
Stop when network changes require provider or physical-network authority not available to the operator.