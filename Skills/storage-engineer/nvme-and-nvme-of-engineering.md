# NVMe and NVMe-oF Engineering

## Purpose
Engineer low-latency NVMe and NVMe-over-Fabrics storage while preserving reliability, observability, and realistic performance expectations.

## When to use
Use for latency-sensitive databases, high-IOPS systems, NVMe-oF deployments, or unexplained device/fabric performance issues.

## Inputs
Device specifications, PCIe topology, namespaces, queue configuration, fabric type, network/RDMA settings, workload profile, and latency targets.

## Context to inspect
NUMA locality, PCIe lanes, firmware, thermal state, multipathing, kernel/driver versions, NICs, switches, and target configuration.

## Core knowledge
NVMe exploits parallel queues and low protocol overhead. End-to-end latency can still be dominated by NUMA, PCIe, network, congestion, target software, or durability behavior. NVMe-oF transports include TCP and RDMA-family approaches with different operational trade-offs.

## Procedure
1. Establish latency/IOPS target and durability semantics.
2. Verify device health, firmware, PCIe width/speed, and thermal behavior.
3. Map NUMA and CPU locality.
4. Validate namespace and queue configuration.
5. For fabrics, verify network loss/congestion behavior and path redundancy.
6. Benchmark realistic queue depths and block sizes.
7. Inspect tail latency, retransmissions, CPU cost, and saturation.
8. Test path/controller failure.
9. Tune only measured bottlenecks.
10. Record stable operating limits.

## Decision points
Use local NVMe for minimum latency when local failure semantics are acceptable; use NVMe-oF when disaggregation and sharing justify network complexity. Prefer TCP where operational simplicity outweighs incremental latency; consider RDMA where measured requirements justify it.

## Common failure patterns
Excessive queue depth, thermal throttling, NUMA mismatch, benchmark-only tuning, single-path fabrics, and assuming device latency equals application latency.

## Verification
Confirm device health, sustained percentile latency, expected bandwidth, failover, and durability under representative load.

## Expected output
Topology assessment, benchmark evidence, tuning changes, and validated limits.

## Stop conditions
Stop on firmware uncertainty, data-integrity errors, unstable fabric behavior, or changes requiring destructive namespace operations.