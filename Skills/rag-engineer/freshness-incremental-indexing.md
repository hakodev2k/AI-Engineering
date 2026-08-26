# Freshness and Incremental Indexing

## Purpose
Keep retrieved knowledge synchronized with authoritative sources within an explicit freshness SLA.

## When to use
Use for mutable corpora, frequently updated policies, tickets, inventories, or operational knowledge.

## Inputs
Source change semantics, update frequency, deletion behavior, index pipeline, freshness SLO, document identities.

## Context to inspect
Inspect source timestamps/version IDs, event feeds, polling limits, ingestion checkpoints, indexing lag, caches, and deletion paths.

## Core knowledge
Freshness is end-to-end: source change, ingestion, parsing, embedding, indexing, cache invalidation, and serving. Modification timestamps alone may not represent semantic version changes.

## Procedure
1. Define measurable freshness SLA by source class.
2. Establish stable document/version identity.
3. Consume reliable change signals where available.
4. Make incremental updates idempotent.
5. Propagate deletes and access revocations.
6. Track source-to-serving lag at each stage.
7. Reconcile periodically to catch missed events.
8. Invalidate dependent caches.
9. Handle reprocessing after parser/embedding version changes.
10. Alert on lag and reconciliation drift.

## Decision points
Use event-driven updates for low-latency reliable feeds; polling/reconciliation for systems without trustworthy events. Batch low-priority sources to reduce cost.

## Common failure patterns
Append-only index; stale cache after reindex; missed tombstones; clock-based incremental logic with ambiguous timestamps; no reconciliation.

## Verification
Inject create/update/delete tests, measure serving lag, and compare source and index versions.

## Expected output
An observable synchronization process meeting defined freshness targets.

## Stop conditions
Stop claims of freshness when source change semantics or deletion propagation cannot be verified.