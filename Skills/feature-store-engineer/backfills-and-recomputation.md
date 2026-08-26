# Backfills and Recomputation

## Purpose
Recompute historical features safely after logic changes, source corrections or newly onboarded history.

## When to use
Use for historical repair, new feature history, contract version migration or recovery from bad computation.

## Inputs
Date/entity range, transformation version, source snapshots, compute capacity, consumers and publication requirements.

## Context to inspect
Current partitions, lineage, model datasets, orchestration quotas, online materialization and retention.

## Core knowledge
Backfills can overwhelm shared infrastructure and can destroy reproducibility if old outputs are mutated without versioning. Scope and publication must be explicit.

## Procedure
1. Define reason, exact scope and expected differences.
2. Freeze transformation and source versions.
3. Estimate scan, compute, storage and downstream load.
4. Choose isolated output/version where reproducibility matters.
5. Process bounded partitions with checkpoints.
6. Apply normal data-quality checks plus before/after comparisons.
7. Rate-limit around production workloads.
8. Record lineage and completion state.
9. Publish only after validation.
10. Notify affected model owners and update references deliberately.

## Decision points
Overwrite only when correction policy explicitly allows it; otherwise publish a new version/snapshot. Prioritize recent partitions when value is time-sensitive.

## Common failure patterns
Unbounded backfills, mutable historical datasets, inconsistent code versions, hidden downstream triggers and online overwrite of newer values.

## Verification
Validate partition completeness, expected deltas, lineage, resource impact and reproducibility of unaffected datasets.

## Expected output
A controlled historical recomputation with auditable versioning and validation evidence.

## Stop conditions
Stop before destructive overwrite, quota exhaustion or publication when expected deltas cannot be explained.