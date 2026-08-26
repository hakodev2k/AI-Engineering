# Change Data Capture Migration

## Purpose
Capture and apply source changes after a baseline copy so the target can converge with minimal downtime.

## When to use
Use when migration duration exceeds acceptable write downtime and source/target support a reliable change stream.

## Inputs
CDC mechanism, transaction log settings, keys, schema-change policy, baseline consistency point, apply pipeline, retention limits, and lag objectives.

## Core knowledge
CDC correctness depends on ordering, transaction boundaries, stable identifiers, delete handling, schema evolution, retention, idempotency, and an exact baseline-to-stream handoff.

## Procedure
1. Define the baseline consistency position.
2. Enable CDC with sufficient retention before baseline starts.
3. Verify all required tables and operations are captured.
4. Define transaction ordering and idempotent apply semantics.
5. Handle inserts, updates, deletes, and key changes explicitly.
6. Define schema-change controls during migration.
7. Monitor capture and apply lag continuously.
8. Reconcile target while CDC is active.
9. Drain lag to the cutover threshold.
10. Record final source position and prove target application through it.

## Decision points
Apply transactionally when cross-row invariants require it; parallelize only where ordering boundaries are understood.

## Common failure patterns
Log retention expiry, missed deletes, duplicate application, baseline/CDC gaps, out-of-order writes, and unsupported DDL changes.

## Verification
Compare captured positions, lag, transaction counts, row-level samples, and reconciliation metrics.

## Expected output
A monitored, resumable CDC path with proven convergence.

## Stop conditions
Stop if capture continuity is lost, retention is exhausted, or ordering correctness cannot be proven.