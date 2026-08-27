# Data Integrity and Corruption Response

## Purpose
Detect, contain, diagnose, and recover from suspected logical or physical corruption without spreading damaged state.

## When to use
Use for checksum failures, impossible records, storage faults, divergent replicas, or integrity-alert incidents.

## Inputs
Integrity symptoms, affected ranges, replica state, checksums, backups, storage telemetry, recent changes.

## Context to inspect
Database integrity tools, replication history, repair logs, hardware/storage events, application validation, backups, and audit trail.

## Core knowledge
Physical corruption and logical corruption require different evidence. Replication can copy corruption. Repair is safe only after establishing trusted state and scope. Preserve forensic evidence before destructive actions.

## Procedure
1. Classify suspected physical versus logical corruption.
2. Isolate affected replicas or write paths when necessary.
3. Preserve logs, checksums, and snapshots.
4. Determine affected keys/ranges and earliest known time.
5. Identify a trusted comparison source.
6. Test recovery on copies first.
7. Repair or restore the minimum affected scope.
8. Revalidate application invariants.
9. Reintroduce repaired nodes gradually.
10. Address the initiating failure mode.

## Decision points
Prefer replica-based repair only when replica trust is established; use point-in-time restore when corruption is widespread or provenance is uncertain.

## Common failure patterns
Immediate full-cluster repair, trusting majority state without provenance, deleting evidence, restoring over healthy data, and ignoring logical corruption caused by application bugs.

## Verification
Run physical checks, logical invariant checks, cross-replica comparisons, and application-level validation after recovery.

## Expected output
A bounded corruption assessment, preserved evidence, validated recovery, and prevention actions.

## Stop conditions
Stop destructive recovery when authoritative state is uncertain or legal/forensic preservation requirements apply.