# Persistent Storage

## Purpose
Design Kubernetes storage for durability, availability, performance, lifecycle, and recovery requirements.

## When to use
Stateful workloads, PVC incidents, storage migration, or capacity planning.

## Inputs
Data durability, IOPS/throughput, access modes, topology, backup needs, growth, and recovery objectives.

## Context to inspect
StorageClasses, PVCs/PVs, CSI drivers, reclaim policies, snapshots, topology constraints, and application consistency model.

## Core knowledge
Kubernetes orchestrates storage attachment but does not make every storage backend highly available. Access mode, zone affinity, reclaim policy, and application consistency matter.

## Procedure
1. Classify data and RPO/RTO.
2. Select backend and StorageClass from measured requirements.
3. Define capacity and expansion behavior.
4. Validate access mode and topology.
5. Choose reclaim policy intentionally.
6. Configure snapshot/backup and restore procedures.
7. Test rescheduling, node loss, expansion, and restore.

## Decision points
Prefer managed external data services when operational complexity outweighs locality benefits; use persistent volumes when Kubernetes lifecycle integration is appropriate.

## Common failure patterns
Treating PVC as backup, single-zone assumptions, Delete reclaim surprises, untested expansion, and benchmarking unrealistic workloads.

## Verification
Restore data into a clean environment and validate application consistency plus performance targets.

## Expected output
Storage design with lifecycle, backup, recovery, and capacity evidence.

## Stop conditions
Escalate destructive migrations or unmet durability requirements.