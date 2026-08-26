# Schema Evolution

## Purpose
Manage schema changes without silently corrupting data or breaking downstream consumers.

## When to use
Use when adding, removing, renaming, retyping, repartitioning, or changing semantics of fields and tables.

## Inputs
Current/proposed schemas, lineage, consumers, compatibility policy, historical data, deployment plan, and rollback capability.

## Context to inspect
Inspect readers and writers, schema registries, transformation code, views, BI models, ML features, retention, backfills, and deployment ordering.

## Core knowledge
Structural compatibility does not guarantee semantic compatibility. Safe evolution requires dependency evidence, ordered rollout, historical-data treatment, and explicit deprecation windows.

## Procedure
1. Classify the proposed structural and semantic change.
2. Enumerate affected producers and consumers through lineage plus code search.
3. Determine compatibility for old readers/new writers and new readers/old data.
4. Define migration and deprecation plan.
5. Introduce additive fields or compatibility layers first where possible.
6. Deploy readers tolerant of both representations.
7. Migrate writers.
8. Backfill historical data when required.
9. Measure adoption and compare old/new outputs.
10. Remove legacy representation only after evidence shows no dependency.
11. Document final contract and rollback limitations.

## Decision points
Use dual-read/dual-write only when the consistency cost is justified. Prefer additive migration over in-place semantic mutation. Backfill only when consumers need historical consistency; otherwise document effective dates.

## Common failure patterns
Rename-as-delete-and-add without migration; changing units under the same field; relying only on declared lineage; dropping fields immediately; partial backfills; incompatible partition changes; no rollback boundary.

## Verification
Run compatibility checks, consumer tests, historical queries, reconciliation between representations, and post-deployment monitoring. Confirm old dependencies have ceased before removal.

## Expected output
A compatibility assessment, migration sequence, verification evidence, deprecation criteria, and rollback plan.

## Stop conditions
Stop before destructive changes when consumers are unknown, lineage is incomplete for critical data, historical semantics cannot be reconciled, or rollback is required but impossible.