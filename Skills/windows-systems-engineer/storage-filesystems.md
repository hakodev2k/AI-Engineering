# Windows Storage and Filesystems

## Purpose
Engineer and troubleshoot Windows storage safely across disks, volumes, NTFS/ReFS, capacity, performance, and data integrity.

## When to use
Use for new storage, low-space incidents, filesystem errors, latency, volume expansion, or storage migration.

## Inputs
Workload I/O profile, capacity, resiliency requirements, filesystem, underlying storage, backup, encryption, and maintenance constraints.

## Preconditions
Confirm backups and storage ownership before destructive partition, format, repair, or migration operations.

## Context to inspect
Physical/virtual disk health, partition/volume layout, filesystem, free space, allocation unit assumptions, mount points, BitLocker, Storage Spaces where used, event logs, latency counters, and SAN/cloud storage state.

## Core knowledge
Separate filesystem behavior from block-storage behavior. Capacity, IOPS, throughput, latency, queue depth, resiliency, and recovery objectives are distinct dimensions. NTFS and ReFS have different feature/support profiles.

## Procedure
1. Define workload, symptom, and required durability/performance.
2. Map logical volumes to underlying storage.
3. Check capacity, health, filesystem events, and latency.
4. Identify whether pressure is growth, transient workload, fragmentation/metadata, storage backend, or application behavior.
5. Choose the least disruptive remediation.
6. For expansion/migration, validate filesystem and platform support.
7. Protect recoverability before destructive work.
8. Execute during an appropriate change window.
9. Validate filesystem, application I/O, backup, and monitoring.
10. Update capacity forecasts.

## Decision points
Expand capacity when growth is legitimate; clean up only data with known ownership and retention rules. Choose ReFS only when its benefits and workload support justify it; do not convert based on novelty.

## Common failure patterns
Deleting unknown files to free space, formatting the wrong disk, treating SAN latency as Windows CPU trouble, expanding without growth controls, and running intrusive repair against live critical workloads.

## Verification
Verify filesystem health, expected capacity, latency/throughput, application read/write behavior, backup coverage, and alert thresholds.

## Expected output
Healthy, supportable storage with quantified capacity and performance state.

## Stop conditions
Stop before destructive disk operations without verified identity/recovery, when hardware/backend ownership is external, or filesystem repair requires downtime not approved.