# Trigger and Event Design

## Purpose
Design reliable workflow entry points for schedules, events, webhooks, queues, file arrivals, database changes, and manual invocations.

## When to use
Use when choosing how a workflow starts or when duplicate, missed, delayed, or out-of-order executions are possible.

## Inputs
Business trigger definition, source-system capabilities, event schema, expected volume, latency requirements, ordering requirements, replay behavior, and failure semantics.

## Context to inspect
Inspect source guarantees, polling intervals, webhook retry policies, event identifiers, timestamps, queue semantics, scheduler timezone behavior, and historical trigger failures.

## Core knowledge
Triggers differ in delivery guarantees. At-most-once risks loss; at-least-once requires idempotency; ordering is rarely global. Schedules require careful timezone and daylight-saving treatment. Polling trades freshness for load.

## Procedure
1. Define the business event precisely.
2. Identify the authoritative source of that event.
3. Determine delivery guarantees and duplicate behavior.
4. Choose push, queue, polling, schedule, CDC, or manual invocation based on source capabilities.
5. Define stable event identifiers and timestamps.
6. Design deduplication and replay behavior.
7. Define ordering requirements explicitly.
8. Set trigger filters as close to the source as practical.
9. Establish dead-letter or recovery handling for malformed events.
10. Instrument trigger lag, failures, and duplicate rates.
11. Test restart, replay, burst, and delayed-delivery scenarios.

## Decision points
Prefer event push when source support is reliable and low latency matters. Prefer queues for buffering and backpressure. Use polling when no dependable event source exists and bounded delay is acceptable.

## Common failure patterns
Using timestamps as unique IDs, assuming exactly-once delivery, ignoring timezone changes, polling too aggressively, filtering after expensive work begins, and losing malformed events without traceability.

## Verification
Inject duplicate, delayed, malformed, and out-of-order events. Confirm exactly the intended business effects occur and trigger metrics expose abnormal behavior.

## Expected output
A trigger design with source, delivery semantics, filters, deduplication, replay, ordering, recovery, and monitoring rules.

## Stop conditions
Stop when the source cannot provide a stable event identity and duplicates would cause unsafe side effects, or when required latency cannot be met by available trigger mechanisms.