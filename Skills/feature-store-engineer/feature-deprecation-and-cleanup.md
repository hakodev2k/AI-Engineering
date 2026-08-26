# Feature Deprecation and Cleanup

## Purpose
Retire unused or superseded features safely to reduce cost, risk and platform complexity without breaking models.

## When to use
Use for duplicate, obsolete, ownerless or expensive features and old versions after migration.

## Inputs
Usage telemetry, consumer inventory, lineage, ownership, retention policy and replacement feature.

## Context to inspect
Training datasets, deployed models, scheduled jobs, online reads, registry references, dashboards and ad-hoc consumers.

## Core knowledge
Absence of recent online reads does not prove a feature is unused; retraining and historical reproducibility may require it. Deprecation is staged.

## Procedure
1. Identify candidate and reason for retirement.
2. Resolve owner and downstream dependencies.
3. Check deployed, retraining and experimentation usage.
4. Announce deprecation with replacement and deadline.
5. Prevent new consumers where tooling permits.
6. Monitor residual usage through the deprecation window.
7. Migrate remaining supported consumers.
8. Disable computation/materialization before deleting history.
9. Observe for regressions.
10. Remove serving data and history according to retention/reproducibility policy.
11. Update registry and lineage state.

## Decision points
Retain historical snapshots when model reproducibility or audit requires them; remove aggressively when sensitive-data minimization requires deletion.

## Common failure patterns
Deleting from registry first, relying only on online traffic, no replacement guidance, perpetual deprecated state and leaving orphan pipelines running.

## Verification
Confirm zero supported dependencies, stopped compute cost, correct registry state and required historical retention/deletion.

## Expected output
A safely retired feature with no orphaned compute or supported consumers.

## Stop conditions
Stop deletion when dependency evidence is incomplete or retention obligations conflict.