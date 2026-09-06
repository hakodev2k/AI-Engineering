# Source Ingestion and Connectors

## Purpose
Build reliable ingestion from heterogeneous knowledge systems into an AI knowledge platform while preserving identity, provenance, permissions, and change semantics.

## When to use
Use when onboarding a new repository, wiki, file store, ticket system, database, API, or content feed. Do not scrape an integration when an official export, API, webhook, or connector can preserve richer metadata and authorization semantics.

## Inputs
Source API or export format, authentication model, rate limits, schemas, permission model, update events, deletion semantics, expected volume, and synchronization targets.

## Preconditions
Access is authorized and the source's terms, data handling rules, and retention constraints are understood.

## Context to inspect
Inspect connector code, API documentation, source identifiers, pagination, delta tokens, timestamps, webhook behavior, attachment handling, retries, and current ingestion metrics.

## Core knowledge
Reliable ingestion is an incremental synchronization problem. Correctness requires idempotency, stable source identities, deletion handling, replay safety, backpressure, checkpoints, and provenance. Successful HTTP responses do not prove complete synchronization.

## Procedure
1. Define the source object types and authoritative identifiers.
2. Map source fields into a canonical ingestion envelope without discarding provenance.
3. Preserve source timestamps, version markers, ownership, and permission metadata.
4. Choose snapshot, incremental polling, CDC, or webhook synchronization based on source capabilities.
5. Design idempotent upserts and deletion/tombstone handling.
6. Implement pagination, rate-limit handling, bounded retries, timeouts, and checkpointing.
7. Separate extraction failures from transformation and indexing failures.
8. Record per-object synchronization status and replay metadata.
9. Validate attachment, rich-text, linked-object, and encoding edge cases.
10. Backfill a bounded sample, reconcile counts, then scale ingestion gradually.
11. Add monitoring for lag, error rate, skipped objects, duplicates, and permission drift.

## Decision points
Prefer event-driven updates for low-latency sources with reliable change events; use incremental polling when webhooks are incomplete or operationally fragile. Use full reconciliation periodically when source deletion or permission events are not trustworthy.

## Common failure patterns
Using display names as identifiers, missing deletions, retry storms, losing ACL metadata, silent pagination truncation, accepting partial exports as complete, and reprocessing the entire corpus for every change.

## Verification
Compare source and destination counts for representative scopes, replay the same batch to prove idempotency, mutate and delete test content, and verify lag and permission propagation.

## Expected output
A production-ready ingestion path with synchronization semantics, checkpoints, observability, replay strategy, and reconciliation evidence.

## Stop conditions
Stop when source authorization is unclear, required permission metadata is inaccessible, destructive source behavior cannot be modeled safely, or the API cannot support a reliable synchronization contract.