# Distributed Data Migrations

## Purpose
Move or reshape authoritative data across service/storage boundaries without unsafe big-bang cutovers or silent divergence.

## When to use
Use for service extraction, database replacement, repartitioning, region moves, ownership transfer, and large online migrations.

## Inputs
Source/target schemas, ownership model, data volume, change rate, downtime tolerance, rollback needs, and consistency requirements.

## Context to inspect
Inspect writers/readers, CDC/events, backfill capability, identifiers, constraints, reconciliation tools, and operational capacity.

## Core knowledge
Online migrations require coexistence phases. Dual writes are deceptively risky unless atomicity/reconciliation is designed. Prefer a single authoritative write path with durable change propagation where possible.

## Procedure
1. Define source of truth at every migration phase.
2. Measure volume, mutation rate, and acceptable lag.
3. Prepare target schema and compatibility.
4. Establish durable change capture/propagation.
5. Backfill historical data in bounded restartable batches.
6. Reconcile counts, checksums, and business invariants.
7. Shadow-read or compare results before cutover.
8. Shift reads gradually, then authoritative writes using an explicit cutover protocol.
9. Monitor divergence and preserve rollback window.
10. Decommission old paths only after sustained verification.

## Decision points
Use CDC/event propagation when ongoing writes must continue. Use maintenance downtime when the simpler approach meets business objectives and materially reduces migration risk.

## Common failure patterns
Uncoordinated dual writes, no reconciliation, one giant backfill, changing IDs without mapping, and deleting source data immediately after cutover.

## Verification
Prove no missing/duplicate entities, validate business aggregates/invariants, test rollback before irreversible cleanup, and monitor post-cutover divergence.

## Expected output
A phased migration runbook with authority, propagation, reconciliation, cutover, rollback, and cleanup.

## Stop conditions
Stop before cutover if reconciliation fails, lag exceeds bounds, rollback is unavailable, or data-loss risk is not understood.