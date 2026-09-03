# Transactional Outbox

## Purpose
Reliably publish events corresponding to committed application state without distributed transactions.

## When to use
Use when a service must persist domain state and arrange event publication atomically.

## Inputs
Database, transaction model, broker, event volume, ordering requirements.

## Context to inspect
Write paths, transactions, publisher process, retry behavior, cleanup, and partition keys.

## Core knowledge
The outbox stores application changes and pending messages in one local transaction. A relay later publishes them. Publication may duplicate, so consumers still require idempotency.

## Procedure
1. Identify state changes requiring events.
2. Define outbox records with stable event identity, payload, metadata, and creation time.
3. Insert business state and outbox record atomically.
4. Build a relay using polling or change-data capture.
5. Publish with stable IDs.
6. Checkpoint publication safely.
7. Retry transient failures with backoff.
8. Define retention and cleanup.
9. Monitor lag, failures, and backlog.
10. Test crashes around publish/checkpoint boundaries.

## Decision points
Use polling for simplicity and portability; CDC for lower latency or high scale when operational maturity supports it. Avoid unprotected dual writes.

## Common failure patterns
Deleting before confirmed publish, assuming exactly-once relay behavior, unindexed polling, no backlog alarms, and invalid ordering assumptions.

## Verification
Crash tests prove committed state eventually emits an event and rolled-back state does not; duplicate publication is safe.

## Expected output
A reliable outbox pipeline with bounded lag, recovery, cleanup, and metrics.

## Stop conditions
Stop if local atomic persistence is unavailable or required global atomicity cannot be reduced to eventual consistency.