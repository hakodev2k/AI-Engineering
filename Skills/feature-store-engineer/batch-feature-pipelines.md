# Batch Feature Pipelines

## Purpose
Build reliable, repeatable batch computations for large-scale offline features and scheduled materialization.

## When to use
Use for hourly/daily features, historical computation and warehouse/lake transformations.

## Inputs
Feature contracts, sources, schedule, compute engine, partitioning, SLA and backfill requirements.

## Context to inspect
Existing orchestration, partitions, dependencies, data quality checks, retries, costs and downstream training jobs.

## Core knowledge
Batch pipelines should be deterministic, partition-aware, idempotent and observable. Incremental processing reduces cost but increases state and correction complexity.

## Procedure
1. Translate feature contracts into deterministic transformations.
2. Choose partition keys aligned with event time and access patterns.
3. Define dependency and watermark rules.
4. Make partition writes idempotent.
5. Separate compute from publication when atomicity matters.
6. Add schema, volume, null and range checks.
7. Bound retries and classify retryable failures.
8. Emit freshness, duration, row-count and failure metrics.
9. Test reruns and partial failures.
10. Benchmark representative partitions.
11. Document backfill and rollback procedures.

## Decision points
Use full recomputation for small or highly correction-prone data; incremental computation for large stable histories. Prefer atomic partition replacement over row mutation where supported.

## Common failure patterns
Non-deterministic UDFs, unbounded scans, duplicate writes, hidden timezone conversion, retry storms and publishing partial output.

## Verification
Rerun identical partitions, compare hashes/statistics, test failure recovery and verify SLA/cost on production-scale samples.

## Expected output
An idempotent batch feature pipeline with quality gates and operational telemetry.

## Stop conditions
Stop before destructive backfills or uncontrolled production-scale scans without approved resource bounds.