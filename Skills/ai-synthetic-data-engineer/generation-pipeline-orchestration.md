# Generation Pipeline Orchestration

## Purpose
Design reliable, reproducible synthetic-data pipelines that coordinate generation, validation, filtering, labeling, deduplication, storage, and release without hidden manual steps.

## When to use
Use when synthetic data moves beyond ad hoc experimentation into recurring or large-scale production workflows.

## Inputs
Generator components, batch sizes, source data, validation stages, storage locations, compute limits, retry policy, release criteria, lineage requirements.

## Preconditions
Each pipeline stage has a defined contract, owner, and failure behavior.

## Context to inspect
Existing workflow orchestration, queues, object storage, model/provider quotas, checkpointing, observability, secrets management, dataset registry, CI/CD conventions.

## Core knowledge
Synthetic pipelines often combine nondeterministic generators with deterministic validators. Reliability requires idempotency, checkpointing, bounded retries, explicit versioning, and separation between generated, validated, quarantined, and released artifacts.

## Procedure
1. Model the workflow as explicit stages with input/output contracts.
2. Separate raw generation from validation and release.
3. Make stages idempotent where practical.
4. Add checkpointing for expensive generation batches.
5. Bound retries and classify retryable versus permanent failures.
6. Persist generator configuration and lineage with each batch.
7. Quarantine failed or suspicious records instead of silently dropping them.
8. Emit metrics for throughput, rejection rate, validator failures, cost, and latency.
9. Gate release on quality, privacy, fairness, and contamination checks.
10. Support reproducible reruns for failed or audited batches.

## Decision points
Use batch orchestration for high-throughput offline generation; use streaming/event-driven designs when synthetic events must arrive continuously. Prefer durable checkpoints when regeneration cost is significant.

## Common failure patterns
Unbounded retries against model APIs, mixing raw and approved data, losing batch provenance, silent partial failures, and making manual cleanup part of the normal process.

## Verification
Replay a representative batch, inject stage failures, confirm restart behavior, and verify only approved artifacts reach the release destination.

## Expected output
A production-ready generation workflow with explicit stages, failure handling, lineage, metrics, and quality gates.

## Stop conditions
Stop when pipeline failures can publish unvalidated data, secrets are exposed to generation jobs, or retry behavior can create uncontrolled cost.