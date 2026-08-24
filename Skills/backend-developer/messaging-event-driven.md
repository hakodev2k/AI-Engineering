# Messaging and Event-Driven Integration

## Purpose
Design reliable asynchronous integrations that tolerate duplicates, retries, reordering, and partial failure.

## When to use
Use for decoupled workflows, event propagation, load leveling, or long-running processing.

## Inputs
Business workflow, delivery guarantees, broker capabilities, ordering needs, throughput, failure/recovery requirements.

## Context to inspect
Existing topics/queues, schemas, consumers, retry policies, dead-letter handling, outbox/inbox mechanisms, and observability.

## Core knowledge
Commands vs events, at-least-once delivery, idempotency, ordering, partitioning, consumer groups, schema evolution, poison messages, backpressure, and replay.

## Procedure
1. Define producer intent and consumer responsibility.
2. Choose event or command semantics.
3. Define stable schema and evolution rules.
4. Choose partition/order key only where ordering matters.
5. Make consumers idempotent.
6. Define retry limits and dead-letter handling.
7. Coordinate database changes with message publication safely.
8. Add correlation, lag, failure, and replay telemetry.
9. Test duplicates, reordering, outages, and replay.

## Decision points
Prefer messaging when temporal decoupling or independent scaling matters; prefer direct calls when immediate response and simple failure semantics dominate.

## Common failure patterns
Assuming exactly-once delivery, global ordering, endless retries, mutable event meaning, non-idempotent consumers, and silent dead-letter queues.

## Verification
Prove recovery after broker/consumer outages, duplicate delivery, poison messages, replay, and schema evolution.

## Expected output
A resilient asynchronous contract and operational recovery model.

## Stop conditions
Stop when ownership, delivery semantics, or replay consequences are undefined.