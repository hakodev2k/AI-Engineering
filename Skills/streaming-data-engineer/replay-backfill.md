# Replay and Backfill

## Purpose
Reprocess historical events safely without corrupting current state or overwhelming production dependencies.

## When to use
Use for bug repair, new derived datasets, model changes, disaster recovery, or historical recomputation.

## Inputs
Replay range, source retention, target semantics, idempotency, expected volume, sink capacity.

## Context to inspect
Offsets/timestamps, schema history, current consumer state, side effects, quotas, correction strategy.

## Core knowledge
Replay changes traffic shape and can reproduce obsolete schemas or side effects. Historical processing must distinguish event time from replay processing time.

## Procedure
1. Define exact reason and success criteria.
2. Identify source range and schema versions.
3. Prove target idempotency or isolate output.
4. Estimate volume and downstream load.
5. Choose separate consumer group/job when appropriate.
6. Throttle below safe capacity.
7. Preserve event-time semantics.
8. Reconcile output against expected counts/state.
9. Promote corrected output atomically where possible.

## Decision points
Replay in-place only when effects are demonstrably idempotent; otherwise write to isolated targets and reconcile before cutover.

## Common failure patterns
Resetting production groups blindly; triggering external side effects again; ignoring old schemas; saturating databases; no reconciliation.

## Verification
Dry-run/sample checks pass, full replay completes within limits, and reconciled outputs meet correctness criteria.

## Expected output
Replay plan, capacity limits, execution evidence, and reconciliation report.

## Stop conditions
Stop if historical schemas, source retention, or side-effect safety cannot be established.