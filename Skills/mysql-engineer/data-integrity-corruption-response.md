# Data Integrity and Corruption Response

## Purpose
Detect, contain, and recover from suspected MySQL data inconsistency or storage corruption with minimal additional loss.

## When to use
Use for checksum errors, unreadable pages/tables, unexplained divergence, invariant violations, or storage faults.

## Inputs
Error logs, affected objects, backups, replicas, checksums, application evidence, storage events.

## Context to inspect
Scope of corruption, replica state, recent DDL/hardware events, backup freshness, binlogs, filesystem/storage health, engine diagnostics.

## Core knowledge
Corruption response is evidence-sensitive. Restarting, forcing recovery, or writing to damaged structures can complicate recovery. Logical inconsistency and physical corruption require different approaches.

## Procedure
1. Classify symptom as logical inconsistency, replica divergence, or physical corruption.
2. Reduce writes to affected data if ongoing damage is possible.
3. Preserve logs, snapshots, and topology evidence.
4. Determine whether healthy replicas contain authoritative copies.
5. Validate backups and required binlogs before destructive action.
6. Use supported integrity checks appropriate to the engine/version.
7. Recover into an isolated environment first when feasible.
8. Reconcile recovered data against business invariants and healthy sources.
9. Replace/rebuild affected node rather than normalizing unsafe state.
10. Investigate storage, software, and operational root cause.

## Decision points
Prefer restore/rebuild from known-good data over in-place repair when integrity confidence is low. Use forced-recovery modes only as last-resort extraction mechanisms with expert review.

## Common failure patterns
Running destructive repair blindly, promoting a divergent replica, overwriting evidence, trusting row counts alone, and returning to service without root-cause containment.

## Verification
Validate checksums/invariants, representative application operations, replication consistency, storage health, and backup recoverability.

## Expected output
Contained incident, authoritative recovery source, validated recovery, and prevention actions.

## Stop conditions
Stop and escalate before destructive repair, forced recovery, or promotion when authoritative data cannot be established.