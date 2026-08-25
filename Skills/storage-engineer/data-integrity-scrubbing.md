# Data Integrity and Scrubbing

## Purpose
Detect, contain, and repair silent corruption using checksums, end-to-end validation, scrubbing, redundancy, and controlled remediation.

## When to use
Use for integrity policy design, checksum alerts, latent corruption, media errors, or post-incident validation.

## Inputs
Checksum capabilities, redundancy model, device health, scrub history, corruption reports, application validation, and backup inventory.

## Preconditions
Preserve suspect evidence and identify authoritative good copies before repair.

## Context to inspect
Filesystem/storage checksums, RAID/EC state, SMART/device telemetry, controller logs, replication, backup checksums, memory/network errors, and application-level hashes.

## Core knowledge
Silent corruption can originate above or below storage media. End-to-end checksums are stronger than device-only protection. Redundancy repairs corruption only when a trustworthy alternate copy exists.

## Procedure
1. Scope affected objects/blocks and time range.
2. Freeze unsafe automatic repair if authority is ambiguous.
3. Validate checksum source and expected value.
4. Inspect redundancy and device health.
5. Compare replicas/backups/application hashes.
6. Repair from a verified good copy.
7. Run targeted then broader scrub.
8. Investigate common-cause hardware/software paths.
9. Confirm no recurrence and update monitoring.

## Decision points
Prefer automatic self-healing when checksums identify a bad copy and quorum/replicas establish a good one. Require manual approval when copies disagree without clear authority.

## Common failure patterns
Repairing from an equally corrupt replica, deleting evidence, ignoring controller/RAM faults, trusting replication as integrity proof, and running aggressive scrubs during saturation.

## Verification
Checksums pass after repair, scrub completes, application validation succeeds, and hardware/system telemetry shows no unresolved source.

## Expected output
An integrity incident record with scope, authoritative copy, repair evidence, root cause or bounded hypothesis, and prevention actions.

## Stop conditions
Stop when no trustworthy copy exists, corruption scope is expanding, or repair may overwrite unique evidence/data.
