# Data Integrity and Corruption Handling

## Purpose
Detect, contain, diagnose, and recover from silent data corruption without allowing bad replicas or damaged media to become authoritative.

## When to use
Use when designing checksums, scrubbing, corruption recovery, or investigating mismatched replicas and unreadable blocks.

## Inputs
Checksum scheme, storage format, replica topology, media error logs, repair history, backup availability, and affected-object metadata.

## Preconditions
Preserve evidence before destructive repair and know which independent copies can be used for validation.

## Context to inspect
Checksums at record/block/object layers, serialization formats, replication repair, filesystem/device error reporting, backup copies, audit logs, and data lineage.

## Core knowledge
Integrity must be checked end to end; media may return incorrect data without obvious failure. Checksums detect change but do not identify the correct replica by themselves. Corruption can propagate through replication, compaction, backup, or application writes, so recovery needs provenance and independent validation.

## Procedure
1. Detect and scope corruption by object, range, node, and time.
2. Quarantine suspect copies from becoming repair sources.
3. Preserve relevant logs and damaged bytes for diagnosis.
4. Compare independent replicas and checksums.
5. Determine whether corruption is localized, systematic, or application-originated.
6. Select a trustworthy source using version and provenance evidence.
7. Restore or reconstruct affected data.
8. Revalidate repaired content before returning it to service.
9. Scan adjacent data for correlated damage.
10. Identify propagation paths such as replication or backup.
11. Correct the underlying hardware, software, or operational cause.
12. Add regression detection and monitoring.

## Decision points
Repair automatically only when authority can be determined safely. Escalate to offline recovery when multiple replicas disagree without a trustworthy ordering or checksum source.

## Common failure patterns
Blind majority voting among correlated bad replicas, overwriting evidence, copying corruption during repair, checksumming only in memory, and declaring success after a single object is restored.

## Verification
Recompute integrity checks, compare replicas, run targeted scrubs, validate application-level invariants, and confirm the corruption source no longer reproduces.

## Expected output
A contained incident or integrity design with detection layers, authority rules, recovery steps, and prevention measures.

## Stop conditions
Stop automated recovery when no trustworthy copy can be established or evidence suggests widespread systemic corruption.