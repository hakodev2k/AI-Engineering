# Warehouse Orchestration and Dependency Design

## Purpose
Design reliable orchestration for warehouse pipelines with explicit dependencies, retries, backfills, scheduling, and failure isolation.

## When to use
Use when building or refactoring DAGs, coordinating ingestion and transformation, reducing cascading failures, or improving operational reliability.

## Inputs
Pipeline graph, freshness SLAs, dependencies, runtime history, retry behavior, backfill needs, external-system constraints.

## Context to inspect
Current scheduler, task granularity, sensors, concurrency limits, idempotency, failure history, and downstream publication gates.

## Core knowledge
Orchestration should coordinate work, not hide business logic. Tasks need deterministic inputs, bounded retries, observable state, and safe replay semantics. Dependency graphs should encode actual data readiness rather than arbitrary clock delays.

## Procedure
1. Map datasets and true upstream dependencies.
2. Separate ingestion, transformation, quality, and publication stages.
3. Define task boundaries that isolate failures without excessive fragmentation.
4. Ensure each task is idempotent or explicitly non-retryable.
5. Set timeouts and bounded retry policies by failure mode.
6. Replace fixed sleeps with readiness checks where possible.
7. Define backfill parameters and concurrency controls.
8. Add quality gates before publication.
9. Emit lineage, timing, and failure telemetry.
10. Exercise partial failure and recovery paths.

## Decision points
Use event-driven triggers when source readiness is asynchronous and reliable. Use schedules when business cadence dominates. Split DAGs when ownership or failure domains differ materially.

## Common failure patterns
Clock-based dependencies, unbounded retries, hidden side effects, giant monolithic DAGs, backfills that overload sources, and publishing partial results.

## Verification
Simulate upstream delay, task retry, partial failure, and backfill; verify no duplicates and that dependent datasets wait for valid inputs.

## Expected output
A recoverable orchestration design with clear dependencies, replay behavior, and operational controls.

## Stop conditions
Stop when tasks cannot be replayed safely and failure recovery would risk corrupting published data.