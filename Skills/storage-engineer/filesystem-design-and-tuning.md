# Filesystem Design and Tuning

## Purpose
Select and configure filesystems for workload semantics, integrity, scale, recoverability, and performance.

## When to use
Use when provisioning hosts, databases, large file repositories, container nodes, or diagnosing filesystem-level behavior.

## Inputs
OS/platform, workload, file counts/sizes, metadata intensity, durability needs, mount requirements, device topology, and recovery expectations.

## Context to inspect
Filesystem type/version, mount options, allocation units, journaling, checksumming, volume manager, discard/TRIM, inode usage, quotas, and backup tooling.

## Core knowledge
Filesystem choices affect allocation, metadata scalability, crash consistency, checksumming, snapshots, fragmentation, and repair behavior. Tuning must match workload and underlying storage guarantees.

## Procedure
1. Characterize file-size and metadata distributions.
2. Identify crash-consistency and integrity requirements.
3. Verify supported filesystem choices for the platform/application.
4. Align filesystem geometry with underlying storage where relevant.
5. Review mount and journaling options for durability implications.
6. Configure quotas and reserved capacity.
7. Establish scrub/check/repair procedures.
8. Benchmark representative operations.
9. Test full-filesystem and inode-exhaustion behavior.
10. Document configuration and recovery commands.

## Decision points
Favor mature defaults unless evidence justifies tuning. Enable integrity features when corruption detection matters; avoid disabling barriers/journaling merely for benchmark gains without an equivalent durability guarantee.

## Common failure patterns
Inode exhaustion with free bytes remaining, unsafe mount flags, no reserved recovery space, misaligned assumptions, excessive small-file metadata load, and running repair without backups.

## Verification
Validate mount state, crash recovery, integrity checks, capacity/inode alerts, and representative workload performance.

## Expected output
Filesystem selection, configuration rationale, operational checks, benchmark evidence, and recovery procedure.

## Stop conditions
Stop before destructive format/repair operations without approved backup and recovery evidence.