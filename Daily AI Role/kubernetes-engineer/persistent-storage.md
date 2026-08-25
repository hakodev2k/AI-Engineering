# Persistent Storage

## Purpose
Design durable Kubernetes storage with explicit performance and recovery semantics.
## When to use
Stateful workloads, PVC failures, migrations, or recovery planning.
## Inputs
Capacity, IOPS/throughput, access mode, RPO/RTO, topology, CSI capabilities.
## Context to inspect
StorageClasses, PV/PVCs, reclaim policy, binding mode, snapshots, encryption, zone affinity.
## Core knowledge
CSI, access modes, topology, reclaim policy, snapshots and backups have different guarantees; Kubernetes orchestration does not replace application-consistent recovery.
## Procedure
1. Classify data criticality. 2. Quantify capacity/performance. 3. Select CSI class and binding mode. 4. Validate scheduling topology. 5. Define expansion/reclaim. 6. Define backup and restore. 7. Test node/zone failure. 8. Measure representative I/O. 9. Exercise restore.
## Decision points
Prefer managed data services when self-hosted state adds risk without value; use delayed binding for topology-aware storage.
## Common failure patterns
Snapshots treated as backups, destructive reclaim policy, incompatible zones, untested restores, and unsupported shared-write assumptions.
## Verification
Prove binding, failover, measured performance, encryption, backup completion, and restore within objectives.
## Expected output
Storage configuration plus lifecycle, performance, recovery, and ownership evidence.
## Stop conditions
Stop before destructive migration or any recovery claim that has not been tested.