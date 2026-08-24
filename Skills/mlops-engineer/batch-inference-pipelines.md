# Batch Inference Pipelines

## Purpose
Run large-scale offline inference with deterministic inputs, bounded cost, restartability, output integrity, and safe publication.

## When to use
Use for scoring warehouses, periodic recommendations, backfills, embeddings, enrichment, or asynchronous predictions.

## Inputs
Model version, input snapshot/query, output schema, partitioning, SLA, resource budget, retry and publication rules.

## Preconditions
Model and input contracts are versioned.

## Context to inspect
Scheduler, storage formats, partition keys, compute engine, idempotency strategy, downstream consumers, and previous backfill behavior.

## Core knowledge
Batch inference is a data pipeline. Correctness requires stable inputs, partition-level retries, deterministic publication, lineage, and protection against duplicate or partial outputs.

## Procedure
1. Freeze model and input references.
2. Define output schema and partition keys.
3. Estimate volume, runtime, and cost.
4. Make partition processing retry-safe.
5. Add completeness and duplicate checks.
6. Record model/input lineage per output partition.
7. Stage outputs before publication.
8. Validate sample and aggregate distributions.
9. Atomically publish or mark complete.
10. Test partial failure and rerun behavior.

## Decision points
Full recompute vs incremental scoring; data-engine-native UDF vs dedicated inference workers; overwrite vs append/versioned outputs.

## Common failure patterns
Mixed model versions, partial tables visible to consumers, duplicate rows after retry, skewed partitions, uncontrolled backfills, and missing input snapshot identity.

## Verification
Re-run selected partitions and confirm deterministic lineage, completeness, uniqueness, and expected distributions.

## Expected output
Versioned batch job, partition/retry policy, publication contract, validation checks, cost estimate, and run evidence.

## Stop conditions
Stop if input snapshot cannot be reconstructed, outputs cannot be safely isolated before publication, or projected cost exceeds approved bounds.