# Training Pipeline Orchestration

## Purpose
Build deterministic, observable, retry-safe training workflows that coordinate data preparation, training, evaluation, registration, and cleanup.

## When to use
Use for scheduled, event-driven, or manually triggered model training beyond ad-hoc notebooks.

## Inputs
Pipeline DAG, datasets, training entry points, compute profiles, artifacts, retry policy, SLAs, and promotion rules.

## Preconditions
Each stage has explicit inputs, outputs, and ownership.

## Context to inspect
Orchestrator, runtime images, storage, credentials, quotas, caches, retry behavior, and failure history.

## Core knowledge
Pipeline tasks should be idempotent where practical, pass immutable references, surface intermediate evidence, and distinguish transient infrastructure failure from deterministic model/data failure.

## Procedure
1. Define stages and data dependencies.
2. Make inputs/outputs immutable and explicit.
3. Containerize or otherwise pin runtime environments.
4. Set resource requests and execution limits.
5. Define timeout and retry classes.
6. Add checkpoints for expensive stages.
7. Emit structured metadata and logs.
8. Prevent automatic promotion after partial success.
9. Test resume, retry, cancellation, and cleanup.
10. Measure end-to-end duration and resource cost.

## Decision points
Single DAG vs composable subflows; caching vs recomputation; spot/preemptible compute vs guaranteed capacity.

## Common failure patterns
Hidden local state, retries that duplicate writes, unlimited retries, stale cache reuse, leaked temporary resources, and success status despite failed evaluation.

## Verification
Run fresh, retry, resume, and forced-failure scenarios and confirm identical artifact lineage for equivalent inputs.

## Expected output
Versioned pipeline, retry matrix, resource policy, telemetry, and recovery runbook.

## Stop conditions
Stop when tasks cannot be made safely repeatable, required credentials violate isolation policy, or resource limits make completion infeasible.