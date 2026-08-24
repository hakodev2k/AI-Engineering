# Platform Events and Event-Driven Design

## Purpose
Use Platform Events and event-driven patterns for decoupled, replayable, eventually consistent workflows without hiding delivery semantics.

## When to use
Use when producers should not depend on synchronous consumers, when external subscribers need change notifications, or when workflows benefit from durable event boundaries.

## Inputs
Event semantics, producers, consumers, ordering needs, replay needs, volume, retention, failure policy.

## Context to inspect
Existing events, Change Data Capture, subscribers, triggers, middleware, replay IDs, monitoring, transaction boundaries.

## Core knowledge
Events are facts, not remote procedure calls. Consumers must tolerate retries, duplicates, delayed delivery, and partial processing. Ordering guarantees are limited and must not be over-assumed.

## Procedure
1. Define the business fact and stable event name.
2. Keep payload minimal and version-compatible.
3. Include correlation and entity identifiers.
4. Define idempotent consumer behavior.
5. Decide publish timing relative to transaction success.
6. Bound subscriber work and hand off expensive processing when needed.
7. Define replay/recovery operations.
8. Test duplicates, out-of-order scenarios, unavailable consumers, and schema evolution.

## Decision points
Choose CDC when consumers need record-change streams; choose custom Platform Events for domain-specific facts and commands with explicit contracts.

## Common failure patterns
Treating events as synchronous calls, oversized payloads, missing idempotency, assuming global ordering, and no replay procedure.

## Verification
Demonstrate publish/subscribe success, duplicate safety, replay, failure recovery, and contract compatibility.

## Expected output
A documented event contract and operationally recoverable producer/consumer design.

## Stop conditions
Escalate when business correctness requires stronger ordering or atomicity than the platform event model provides.