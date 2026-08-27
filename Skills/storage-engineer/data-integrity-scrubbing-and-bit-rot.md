# Data Integrity, Scrubbing, and Bit Rot

## Purpose
Detect, contain, repair, and prevent silent data corruption across storage layers.

## When to use
Use when designing integrity controls, responding to checksum errors, defining scrub schedules, or validating long-retention storage.

## Inputs
Checksum capabilities, redundancy scheme, media health, scrub history, application checksums, backup copies, and corruption reports.

## Context to inspect
Filesystem/storage checksums, ECC/error telemetry, SMART/device health, controller logs, replication, snapshots, and backup verification.

## Core knowledge
Redundancy without integrity metadata may replicate corruption. End-to-end checksums detect errors across media, memory, transport, and software paths. Scrubbing finds latent faults before another failure removes repair options.

## Procedure
1. Determine where checksums are generated and verified.
2. Identify unprotected segments in the data path.
3. Establish regular scrub cadence based on data value and media risk.
4. Monitor corrected and uncorrectable errors.
5. On corruption, preserve evidence and isolate affected components.
6. Identify trustworthy replicas/backups before repair.
7. Repair from verified-good data.
8. Re-scrub affected scope.
9. Investigate correlated hardware/software causes.
10. Track recurring error rates and replace suspect components.

## Decision points
Prefer end-to-end checksums for critical data; increase scrub frequency for cold data or higher-risk media while balancing performance impact. Never repair by blindly copying from an unverified replica.

## Common failure patterns
No checksums, scrubs never run, checksum alerts ignored, corrupted source replicated to backups, and destructive repair before evidence capture.

## Verification
Confirm checksums pass after repair, independent backup/replica validity, scrub completion, and no continuing hardware error trend.

## Expected output
Integrity-control design or incident record with affected scope, trusted source, repair evidence, and preventive actions.

## Stop conditions
Stop writes and escalate when corruption scope is expanding, no trustworthy copy is known, or repair could destroy forensic evidence.