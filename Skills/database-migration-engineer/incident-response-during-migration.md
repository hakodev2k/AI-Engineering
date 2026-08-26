# Incident Response During Database Migration

## Purpose
Handle migration failures rapidly without sacrificing evidence, data integrity, or decision discipline.

## When to use
Use when migration causes or coincides with service degradation, data divergence, replication failure, capacity exhaustion, or security concerns.

## Inputs
Incident symptoms, migration stage, runbook, telemetry, checkpoints, replication positions, rollback plan, ownership roster, and business impact.

## Core knowledge
Migration incidents combine operational urgency with stateful data risk. Restarting components blindly can destroy evidence or duplicate writes. Stabilization and authority control precede optimization.

## Procedure
1. Declare incident severity and incident commander when thresholds require it.
2. Freeze nonessential migration actions.
3. Preserve logs, checkpoints, positions, and timestamps.
4. Establish current source/target authority and write paths.
5. Stabilize customer impact without creating split-brain writes.
6. Classify failure: transfer, sync, data, performance, access, infrastructure, or application.
7. Compare rollback versus forward-fix using current data state.
8. Execute the approved path with explicit checkpoints.
9. Reconcile data before restoring normal change velocity.
10. Document timeline, root cause, and migration-plan corrections.

## Decision points
Prioritize data integrity over migration schedule. Roll back only when data-preservation mechanics are understood; otherwise isolate and forward-fix under incident control.

## Common failure patterns
Multiple operators changing state independently, retry storms, deleting failed artifacts, ambiguous write authority, and schedule-driven decisions.

## Verification
Service stabilizes, authoritative data is reconciled, write paths are singular and known, and corrective actions are validated.

## Expected output
A controlled incident outcome with preserved evidence and updated migration safeguards.

## Stop conditions
Stop autonomous migration activity whenever write authority, data state, or recovery path is ambiguous.