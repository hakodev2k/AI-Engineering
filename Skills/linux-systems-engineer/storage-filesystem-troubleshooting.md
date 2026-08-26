# Storage and Filesystem Troubleshooting

## Purpose
Diagnose Linux block-device, filesystem, capacity, latency, and integrity problems safely.

## When to use
Use for I/O latency, full filesystems, inode exhaustion, read-only remounts, device errors, or application storage stalls.

## Inputs
Mount layout, device topology, filesystem type, I/O metrics, kernel logs, capacity and workload characteristics.

## Context to inspect
Inspect LVM/RAID/cloud volumes, multipath, encryption, mount options, quotas, inode usage, device health, queueing, and backup/recovery posture.

## Core knowledge
Understand block layers, page cache, fsync semantics, queue depth, latency vs throughput, inode allocation, journaling, filesystem consistency, and device failure signals.

## Procedure
1. Identify affected path and backing device chain.
2. Check space, inodes, mounts, read-only state, and quotas.
3. Measure latency, utilization, queueing, throughput, and errors.
4. Correlate kernel/device logs with symptom timestamps.
5. Distinguish workload saturation from device/filesystem faults.
6. Inspect mount and application durability behavior.
7. Protect data before repair operations.
8. Apply non-destructive remediation first.
9. Validate filesystem, application, and durability behavior.

## Decision points
Resize for legitimate capacity demand; optimize workload for avoidable I/O; repair only with recovery plan; replace devices when fault evidence warrants it.

## Common failure patterns
Deleting files without checking open handles, running repair on mounted filesystems, ignoring inode exhaustion, benchmarking through cache unintentionally, and assuming high utilization alone proves failure.

## Verification
Confirm normal capacity, inode availability, error-free logs, acceptable latency/queue depth, successful durability checks, and application recovery.

## Expected output
Storage-layer diagnosis, safe remediation, data-risk assessment, and verification evidence.

## Stop conditions
Stop before destructive repair, filesystem recreation, RAID changes, or operations lacking verified backup/recovery approval.