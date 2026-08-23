# Transactional Inbox

## Purpose
Reliably receive messages and coordinate deduplication with local state transitions.

## When to use
Use for consumers requiring durable receipt, replay control, or atomic local processing.

## Inputs
Message IDs, local database, processing transaction, retention and throughput requirements.

## Context to inspect
Acknowledgment behavior, concurrency, poison handling, storage growth and recovery workflow.

## Core knowledge
An inbox records receipt/processing state durably and can separate broker delivery from application processing while supporting deduplication.

## Procedure
1. Define unique message identity.
2. Persist receipt with uniqueness enforcement.
3. Coordinate application state and inbox status transactionally.
4. Acknowledge only at the intended durability point.
5. Recover pending records safely.
6. Archive or expire records using a justified window.
7. Monitor backlog and failures.

## Decision points
Use a full inbox when durable workflow visibility is valuable; use a simpler idempotency key when sufficient.

## Common failure patterns
Non-atomic status updates, weak uniqueness, premature acknowledgment and unlimited retention.

## Verification
Redeliver and crash during processing; verify eventual completion without duplicate business effects.

## Expected output
A recoverable inbox design with explicit lifecycle.

## Stop conditions
Escalate if local persistence cannot provide required atomicity.