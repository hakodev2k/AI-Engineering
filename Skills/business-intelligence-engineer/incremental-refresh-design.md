# Incremental Refresh Design

## Purpose
Design reliable incremental ingestion and BI refresh strategies that reduce latency and compute without corrupting history.

## When to use
Use when full reloads exceed acceptable duration/cost or when near-real-time reporting requires bounded updates.

## Inputs
Source change semantics, timestamps/CDC, keys, late-arrival window, partition scheme, retention, refresh SLA.

## Context to inspect
Inspect source update/delete behavior, clock precision, backfills, orchestration retries, partition pruning, and target merge semantics.

## Core knowledge
Incremental correctness requires a trustworthy change boundary, idempotency, delete handling, and late-data strategy. A timestamp alone is unsafe if updates can share timestamps or arrive out of order.

## Procedure
1. Define required freshness and recovery objectives.
2. Identify reliable change capture: CDC, sequence, version, or timestamp plus overlap.
3. Define deterministic watermark semantics.
4. Select partitions aligned with query and refresh behavior.
5. Implement idempotent upsert/delete processing.
6. Include overlap or reprocessing window for late arrivals.
7. Persist watermarks only after successful target commit.
8. Design backfill and full-rebuild procedures.
9. Monitor lag, processed rows, rejected rows, and partition duration.
10. Test retries, duplicate delivery, late updates, deletes, and backfills.

## Decision points
Prefer CDC when available and operationally trustworthy. Use rolling-window reprocessing when source change tracking is weak but bounded lateness exists.

## Common failure patterns
Advancing watermark before commit, missing deletes, timestamp gaps, non-idempotent merges, partition explosion, and no recovery path for historical corrections.

## Verification
Compare incremental output to an independent full rebuild on representative history and test failure/retry scenarios.

## Expected output
Documented incremental algorithm, watermark, partitions, recovery path, monitoring, and equivalence evidence.

## Stop conditions
Stop when source changes cannot be reliably detected, historical corrections are unbounded without rebuild support, or target merge semantics are unsafe.