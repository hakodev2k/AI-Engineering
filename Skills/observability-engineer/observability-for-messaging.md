# Observability for Messaging

## Purpose
Instrument asynchronous queues, streams, and event-driven workflows so delay, loss, retries, duplication, and poison messages are diagnosable.

## When to use
Use for brokers, background workers, event buses, streaming systems, and asynchronous integration flows.

## Inputs
Messaging topology, producer/consumer code, broker metrics, retry policy, dead-letter behavior, and tracing support.

## Context to inspect
Inspect enqueue/dequeue timestamps, partitioning, consumer groups, offsets, delivery attempts, dead-letter queues, idempotency, and propagation headers.

## Core knowledge
Async health depends on backlog age and processing latency, not only queue depth. Trace causality may require links rather than simple parent-child relationships.

## Procedure
1. Map producer-to-consumer flows.
2. Instrument publish and consume operations.
3. Propagate safe trace context.
4. Measure publish failures, processing outcomes, lag, backlog age, retries, and dead letters.
5. Add bounded message-type and destination dimensions.
6. Correlate consumer logs with message and trace identifiers.
7. Alert on user-impacting lag or poison-message growth.
8. Test retry and dead-letter scenarios.

## Decision points
Use backlog age when processing deadlines matter; use depth for capacity context. Avoid payload logging unless explicitly safe.

## Common failure patterns
Monitoring only broker availability, missing consumer lag, trace breaks, logging payload secrets, and retries that hide persistent failure.

## Verification
Inject delayed, failed, retried, and dead-lettered messages and confirm each state is visible and attributable.

## Expected output
End-to-end asynchronous telemetry with actionable lag and failure indicators.

## Stop conditions
Stop when message content classification or broker semantics are unknown.