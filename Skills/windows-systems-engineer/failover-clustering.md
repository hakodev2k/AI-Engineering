# Windows Failover Clustering

## Purpose
Operate Windows failover clusters while preserving quorum, workload availability, and recoverability.

## When to use
Use for cluster deployment, node maintenance, failover incidents, quorum issues, patching, or clustered workload changes.

## Inputs
Cluster topology, workload roles, quorum/witness design, networks, shared/storage architecture, maintenance window, and application failover requirements.

## Preconditions
Know current quorum votes, node health, ownership, and recovery path before taking nodes or resources offline.

## Context to inspect
Cluster validation, node/resource state, quorum, witness, networks, storage, recent cluster logs/events, dependency graph, preferred owners, failover thresholds, and application health.

## Core knowledge
Cluster availability depends on quorum and resource dependencies, not merely node count. Planned drain differs from abrupt failure. Cluster validation and supported hardware/storage/network configurations matter.

## Procedure
1. Establish cluster role, SLA, and current healthy topology.
2. Check node, network, storage, witness, and resource health.
3. Calculate impact of removing or losing a node.
4. Drain roles before planned maintenance where supported.
5. Perform one bounded change at a time.
6. Return the node and verify cluster membership/health.
7. Fail workloads deliberately when validation requires it.
8. Confirm application-level continuity and data consistency.
9. Review cluster logs for hidden instability.
10. Document topology or policy changes.

## Decision points
Choose witness type based on topology and failure domains. Prefer dynamic quorum behavior unless a specific design requires otherwise. Do not use forced quorum except under explicit disaster-recovery procedures.

## Common failure patterns
Taking multiple nodes down without quorum analysis, validating only resource state, ignoring storage/network faults, forcing resources online, and patching all nodes concurrently.

## Verification
Verify quorum, node membership, resource health, failover/failback behavior, storage/network paths, and workload transactions.

## Expected output
A supported cluster state with demonstrated workload availability.

## Stop conditions
Stop when quorum would be lost, storage consistency is uncertain, cluster validation exposes unsupported configuration, or forced recovery is being considered without disaster-recovery authority.