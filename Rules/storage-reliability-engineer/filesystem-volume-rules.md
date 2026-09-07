# Filesystem and Volume Rules

## Purpose
Prevent filesystem and volume-layer behavior from undermining storage guarantees.

## Scope
Applies to filesystems, logical volumes, mount options, allocation, journaling, snapshots, and resize operations.

## MUST
- Understand crash-consistency and journaling semantics for critical workloads.
- Validate resize, snapshot, and restore procedures before production use.
- Monitor inode, metadata, fragmentation, and free-space limits where applicable.

## MUST NOT
- Change filesystem or mount safety semantics for performance without evidence and approval.
- Assume online resize is risk-free without compatibility and rollback checks.
- Ignore metadata exhaustion because block capacity appears healthy.

## SHOULD
- Standardize supported filesystem configurations and lifecycle procedures.
- Test unclean shutdown and recovery behavior.

## Exceptions
Nonstandard configurations require documented workload need, operational support plan, and review.

## Verification
Inspect mount and volume configuration, recovery tests, filesystem health checks, capacity telemetry, and change records.