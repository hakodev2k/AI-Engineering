# Batch Pipeline Design

## Purpose
Design reliable batch pipelines that move and transform bounded datasets with predictable correctness, recovery, and operating cost.

## When to use
Use for scheduled ingestion, ETL/ELT, back-office processing, periodic aggregates, and workloads whose latency target permits batching.

## Inputs
Sources, destinations, data volume, schedule, SLA, transformation rules, dependency graph, and failure history.

## Context to inspect
Inspect source change behavior, extraction limits, watermark fields, target write semantics, orchestration platform, retries, and historical runtime distribution.

## Core knowledge
A production batch is a state transition, not merely a script. Important concepts include incremental extraction, checkpoints, idempotency, deterministic transformations, dependency isolation, bounded retries, backfills, and observable run state.

## Procedure
1. Define freshness and completion SLAs.
2. Determine full versus incremental extraction.
3. Choose stable watermarks or change tracking.
4. Separate extraction, transformation, validation, and publication stages.
5. Make writes idempotent or explicitly transactional.
6. Persist checkpoints only after durable completion.
7. Define retryable and terminal failures.
8. Add run metadata, metrics, alerts, and lineage.
9. Test partial failure and restart behavior.
10. Document backfill and rerun procedures.

## Decision points
Use full loads when data is small and simplicity dominates; incremental loads when scale or source cost demands it. Prefer recomputable intermediate data when recovery complexity would otherwise become excessive.

## Common failure patterns
Timestamp watermarks with gaps, marking success before publication, duplicate writes on retry, unbounded catch-up runs, hidden cross-job dependencies, and no backfill path.

## Verification
Run the same batch twice, simulate failure between stages, compare row counts and checksums, validate watermark progression, and prove SLA observability.

## Expected output
A restartable, observable batch pipeline with explicit state, dependencies, recovery, and backfill behavior.

## Stop conditions
Stop when no stable incremental boundary exists, source extraction could overload production, or destructive publication requires approval.