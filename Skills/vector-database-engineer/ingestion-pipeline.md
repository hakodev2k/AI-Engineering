# Vector Ingestion Pipeline

## Purpose
Build reliable pipelines that transform source records into validated, versioned, searchable vector data.

## When to use
Use for initial loads, continuous ingestion, re-embedding, or ingestion reliability work.

## Inputs
Source system, change semantics, embedding service, schema, throughput/freshness targets, retry policy, and deletion rules.

## Context to inspect
Inspect source revisions, CDC/events, batching, rate limits, embedding version, upsert keys, checkpoints, DLQ, metrics, and reconciliation jobs.

## Core knowledge
Vector ingestion is a distributed data pipeline: at-least-once delivery requires idempotency; partial failures require durable checkpoints; source and embedding versions must be traceable. Backpressure protects both embedding services and databases.

## Procedure
1. Define source-of-truth and freshness SLO.
2. Define deterministic identity and source revision.
3. Validate and sanitize source content.
4. Batch embedding requests within provider/resource limits.
5. Attach model/version and provenance.
6. Use idempotent upserts and bounded retries with jitter.
7. Persist checkpoints after durable writes.
8. Route poison records to a reviewable DLQ.
9. Propagate deletes/tombstones.
10. Reconcile source counts/revisions against vector storage.
11. Monitor lag, errors, retry rates, throughput, and embedding cost.

## Decision points
Use streaming for tight freshness and stable event sources; batch for economical bulk processing. Prefer at-least-once plus idempotency over fragile exactly-once claims across heterogeneous systems.

## Common failure patterns
Acknowledging before durable write; duplicate vectors from unstable IDs; infinite retries; no deletion path; mixed embedding versions; unbounded concurrency; lost checkpoints; silent truncation; no reconciliation.

## Verification
Replay a batch, inject partial failures, verify idempotency, recover from checkpoint, test deletes, and compare source/vector counts and revisions.

## Expected output
A recoverable ingestion pipeline with explicit identity, versioning, backpressure, observability, and reconciliation.

## Stop conditions
Stop if source ownership/deletion semantics are unknown, credentials are unavailable, or replay could create destructive side effects.