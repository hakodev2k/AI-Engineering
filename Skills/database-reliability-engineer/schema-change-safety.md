# Schema Change Safety

## Purpose
Deliver schema changes without avoidable downtime, blocking, data loss, or incompatible application states.

## When to use
Use for migrations, index changes, column changes, constraints, repartitioning, and large backfills.

## Inputs
Schema diff, table sizes, traffic, engine behavior, deployment sequence, rollback needs, and compatibility requirements.

## Context to inspect
Lock semantics, transaction duration, replication impact, application versions, migration tooling, and maintenance windows.

## Core knowledge
Safe migrations separate compatibility from cleanup. Expand-and-contract patterns reduce coupling between application and schema rollout.

## Procedure
1. Classify change risk and affected workloads.
2. Determine locks, rewrites, log growth, and replication effects.
3. Design backward/forward-compatible phases.
4. Separate schema creation, backfill, application cutover, validation, and cleanup.
5. Bound batch sizes and transaction duration.
6. Define abort thresholds.
7. Rehearse on production-like data volume.
8. Deploy with telemetry.
9. Validate data and application behavior before cleanup.

## Decision points
Prefer online/concurrent operations when engine guarantees are understood. Schedule maintenance when online execution cannot meet risk limits.

## Common failure patterns
Single giant migrations, destructive changes before application cutover, unbounded backfills, unexpected table locks, and no rollback path.

## Verification
Measure lock time, replication lag, resource use, data correctness, and compatibility across deployment phases.

## Expected output
A phased migration plan, safety thresholds, rollback procedure, and validation evidence.

## Stop conditions
Stop if lock/rewrite behavior is uncertain, backup/recovery is inadequate, or destructive cleanup lacks explicit approval.