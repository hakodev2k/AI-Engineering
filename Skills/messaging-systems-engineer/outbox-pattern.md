# Transactional Outbox

## Purpose
Prevent divergence between committed application state and messages that must be published from it.

## When to use
Use when a database change and message publication must behave as one reliable business transition.

## Inputs
Database, transaction model, event payloads, publisher mechanism and latency requirements.

## Context to inspect
Write transaction, schema, polling/CDC options, ordering, cleanup and duplicate handling.

## Core knowledge
The outbox stores application changes and publication intent atomically, then publishes asynchronously; consumers must still tolerate duplicates.

## Procedure
1. Identify dual-write failure windows.
2. Store outbox record in the business transaction.
3. Define immutable payload and metadata.
4. Implement polling or CDC publisher.
5. Confirm publication before marking/cleaning records.
6. Add retry, backoff and observability.
7. Bound retention and backlog growth.
8. Test crashes at every transition.

## Decision points
Use polling for simplicity; use CDC when latency/scale justifies additional infrastructure.

## Common failure patterns
Deleting before publish confirmation, unbounded tables, no ordering strategy and assuming outbox removes duplicates.

## Verification
Crash publisher around send/mark transitions and prove no committed business event is lost.

## Expected output
A durable outbox pipeline with recovery and monitoring.

## Stop conditions
Stop if transaction ownership or database durability assumptions cannot be established.