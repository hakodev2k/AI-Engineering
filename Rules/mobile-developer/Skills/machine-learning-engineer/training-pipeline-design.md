# Training Pipeline Design

## Purpose
Build reliable, repeatable training workflows from validated data through registered model artifacts.

## When to use
When moving experiments beyond notebooks or establishing recurring retraining.

## Inputs
Data sources, feature logic, trainer, evaluation code, infrastructure, artifact registry, trigger policy.

## Context to inspect
Dependencies, compute requirements, failure recovery, idempotency, data freshness, orchestration, secrets, and artifact retention.

## Core knowledge
Training pipelines should separate deterministic stages, make inputs/outputs explicit, and fail closed on invalid data or evaluation. Retraining is a software production process.

## Procedure
1. Define stage contracts: ingest, validate, transform, train, evaluate, package, register.
2. Make each stage reproducible and independently testable.
3. Pin code/dependencies and version data inputs.
4. Add resource limits, timeouts, retries only for transient operations.
5. Persist intermediate lineage and logs.
6. Gate registration on evaluation criteria.
7. Support resume/retry without corrupting artifacts.
8. Test clean-run and failure paths.

## Decision points
Use batch orchestration for scheduled training; event triggers only when freshness requirements justify complexity. Cache immutable expensive stages when safe.

## Common failure patterns
Notebook-only training, mutable shared paths, retrying deterministic failures, registering failed candidates, and hidden manual preprocessing.

## Verification
A clean pipeline run produces a lineage-complete artifact and intentional stage failure does not promote it.

## Expected output
Automated training pipeline with explicit contracts, gates, lineage, and recovery behavior.

## Stop conditions
Stop when data validation fails, mandatory evaluation fails, or required lineage cannot be recorded.