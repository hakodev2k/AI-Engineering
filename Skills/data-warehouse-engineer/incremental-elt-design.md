# Incremental ELT Design

## Purpose
Design efficient, idempotent incremental warehouse transformations that process only necessary changes while preserving correctness.

## When to use
Use when full refreshes are too slow or expensive, or when freshness requirements demand frequent ingestion and transformation.

## Inputs
Source change semantics, timestamps or CDC metadata, target grain, unique keys, transformation logic, correction rules, retention policy.

## Context to inspect
Source update/delete behavior, watermark reliability, target merge capabilities, late data, orchestration retries, and current full-refresh logic.

## Core knowledge
Incremental processing trades simplicity for state. Watermarks, merge keys, lookback windows, CDC offsets, and replay behavior must be explicit. Idempotency is required because retries are normal.

## Procedure
1. Establish the target grain and stable unique key.
2. Determine how inserts, updates, and deletes are detected.
3. Select watermark, CDC, or partition-replacement strategy.
4. Define a lookback policy for late changes when needed.
5. Implement deterministic merge or overwrite behavior.
6. Make retries idempotent.
7. Handle deletes and source corrections explicitly.
8. Persist checkpoint state only after successful completion.
9. Add reconciliation against periodic full comparisons.
10. Document backfill and reset procedures.

## Decision points
Use merge for sparse row changes, partition overwrite for bounded partitions, and CDC when durable ordered change streams exist. Prefer full refresh when datasets are small and simplicity wins.

## Common failure patterns
Advancing watermarks before commit, missing deletes, nondeterministic merges, relying on mutable update timestamps, and unrecoverable checkpoint state.

## Verification
Replay the same batch twice, inject late updates and deletes, compare incremental output with an independent full rebuild, and inspect row-level diffs.

## Expected output
An incremental pipeline with explicit state, replay semantics, reconciliation, and backfill procedures.

## Stop conditions
Stop when no reliable change signal or reconciliation path exists for data whose correctness is material.