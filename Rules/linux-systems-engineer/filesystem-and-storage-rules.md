# Filesystem and Storage Rules

## Purpose
Preserve data integrity, capacity, recoverability, and predictable storage behavior.

## Scope
Applies to block devices, LVM, filesystems, mounts, quotas, RAID, cloud volumes, and storage expansion or replacement.

## MUST
- Storage changes MUST identify data criticality, redundancy, backup state, capacity headroom, and failure domain before execution.
- Filesystem and mount choices MUST match workload durability, performance, permission, and recovery requirements.
- Persistent mounts MUST use stable device identifiers and defined failure behavior.
- Capacity thresholds MUST account for filesystem behavior, inode exhaustion, log growth, snapshots, and workload burst patterns.
- Destructive operations such as filesystem creation, volume reduction, partition replacement, or device removal MUST require explicit human approval and a verified target.

## MUST NOT
- A storage device MUST NOT be reformatted or detached based only on an ambiguous device name.
- RAID or replication MUST NOT be represented as a backup.
- Full-filesystem incidents MUST NOT be mitigated by deleting unknown data without ownership and impact assessment.

## SHOULD
- Separate high-growth or failure-prone data from root filesystems when justified.
- Prefer online expansion over risky shrink operations.
- Monitor latency and error indicators in addition to capacity.

## Exceptions
Emergency capacity actions require preserved evidence, bounded scope, rollback/recovery consideration, and post-incident reconciliation.

## Verification
Inspect block topology, mount configuration, filesystem health, SMART/platform signals where applicable, capacity/inodes, backup status, redundancy state, and recovery tests. For destructive work, independently verify device identity immediately before execution.