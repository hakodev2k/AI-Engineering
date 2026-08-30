# CDC Ingestion and Change Semantics

## Purpose
Ingest database change data into a warehouse while preserving ordering, operation type, keys, and recoverability.

## When to use
Use for low-latency replication, mutable operational sources, delete capture, or incremental models that require authoritative changes.

## Inputs
Source database behavior, CDC stream or logs, primary keys, transaction metadata, schema evolution rules, target tables, latency objectives.

## Context to inspect
Connector guarantees, ordering scope, duplicate delivery, transaction boundaries, snapshot/bootstrap behavior, retention, and replay controls.

## Core knowledge
CDC systems often provide at-least-once delivery. Correctness requires deterministic deduplication, durable offsets, operation semantics, and careful snapshot-to-stream handoff. Ordering may be global, partitioned, or key-scoped.

## Procedure
1. Document emitted operations and ordering guarantees.
2. Identify source keys and transaction metadata.
3. Plan initial snapshot and stream cutover.
4. Persist raw change events before destructive consolidation when practical.
5. Deduplicate using durable event identity or source log position.
6. Apply inserts, updates, and deletes idempotently.
7. Handle out-of-order and late events.
8. Detect schema changes before application failures propagate.
9. Monitor lag, missing ranges, duplicates, and poison events.
10. Test replay from a known checkpoint.

## Decision points
Retain an append-only raw CDC layer when auditability or replay is important. Collapse directly only when recovery guarantees remain sufficient.

## Common failure patterns
Lost deletes, duplicate application, snapshot/stream gaps, schema drift, advancing offsets before durable writes, and assuming total ordering where none exists.

## Verification
Reconcile source and target samples, replay a captured interval, confirm deletes, and validate zero gaps across snapshot handoff.

## Expected output
A recoverable CDC pipeline with explicit guarantees, offsets, deduplication, and monitoring.

## Stop conditions
Stop when source retention cannot cover expected outages or key/ordering guarantees are insufficient for correct application.