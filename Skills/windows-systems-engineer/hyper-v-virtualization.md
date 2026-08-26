# Hyper-V Virtualization

## Purpose
Operate Hyper-V hosts and virtual machines with reliable compute, networking, storage, migration, and availability behavior.

## When to use
Use for VM provisioning, host maintenance, live migration, virtualization performance, virtual networking, or Hyper-V incidents.

## Inputs
Host/cluster design, VM workload requirements, CPU/memory/storage/network needs, availability, backup, and migration constraints.

## Preconditions
Confirm host capacity and VM recovery. Clustered Hyper-V work must preserve quorum and workload headroom.

## Context to inspect
Host health, VM state/configuration, checkpoints, dynamic memory, virtual switches, vNICs, storage paths, integration services, NUMA considerations, live migration settings, cluster state, and backup integration.

## Core knowledge
Virtualization adds resource scheduling and abstraction layers. Host contention can appear as guest application problems. Production checkpoints are not backups. Overcommit decisions must consider workload variability and failover capacity.

## Procedure
1. Define workload resource and availability requirements.
2. Inspect host and cluster headroom before placement/change.
3. Validate virtual networking and storage dependencies.
4. Size CPU/memory based on measured demand, not arbitrary ratios.
5. Use supported VM generation/security features.
6. For maintenance, migrate/drain workloads before host disruption.
7. Monitor host and guest performance together.
8. Validate backup and restore integration.
9. Remove stale checkpoints only after understanding merge/storage impact.
10. Record capacity and placement changes.

## Decision points
Use dynamic memory when workload/support characteristics suit it. Use live migration for planned movement when network/storage architecture supports it. Choose clustering when availability requirements justify operational complexity.

## Common failure patterns
Treating checkpoints as backups, excessive overcommit, ignoring host storage latency, unmanaged checkpoint growth, changing virtual switches remotely without recovery access, and validating only guest ping.

## Verification
Verify guest workload, host headroom, storage/network health, migration behavior, cluster state where applicable, and backup success.

## Expected output
A stable virtualization configuration with measured capacity and recovery evidence.

## Stop conditions
Stop when host changes threaten management connectivity, failover capacity is insufficient, storage health is uncertain, or migration would violate workload support constraints.