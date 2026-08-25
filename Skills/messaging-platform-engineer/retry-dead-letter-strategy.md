# Retry and Dead-Letter Strategy

## Purpose
Design bounded retry and dead-letter handling that recovers transient failures without creating retry storms, invisible data loss, or permanently blocked consumers.

## When to use
Use for any workload that can fail after message delivery or requires operator-assisted recovery.

## Inputs
- Failure categories
- Business retry tolerance
- Dependency recovery times
- Message ordering constraints
- Broker retry/DLQ capabilities

## Context to inspect
Inspect current retry loops, delay mechanisms, dead-letter queues, poison-message handling, alerting, and replay tools.

## Core knowledge
Retries amplify load. Senior engineers should distinguish transient, throttling, validation, dependency, and permanent business failures; understand exponential backoff, jitter, delayed queues/topics, max attempts, TTL, and replay safety.

## Procedure
1. Classify expected failure modes.
2. Mark failures as retryable or terminal using explicit rules.
3. Set attempt limits and backoff windows based on dependency recovery characteristics.
4. Add jitter to distributed retries.
5. Route exhausted messages to a durable dead-letter destination with failure metadata.
6. Define retention, access controls, and alert thresholds for DLQs.
7. Build a controlled replay procedure that preserves idempotency.
8. Monitor retry rates separately from primary traffic.
9. Test dependency outages and malformed messages.

## Decision points
Use in-place retry only for short transient failures. Use delayed destinations for longer waits so consumers are not blocked. Never retry deterministic validation failures indefinitely.

## Common failure patterns
- Immediate infinite retry loops
- DLQs with no owner or alerts
- Replaying messages without fixing the cause
- Mixing retry traffic with normal throughput invisibly
- Losing original failure context

## Verification
Trigger each failure class, verify attempt counts and delays, confirm terminal routing, and replay a sample safely after remediation.

## Expected output
A retry matrix, dead-letter policy, alerting plan, and verified replay procedure.

## Stop conditions
Stop when failure classification is unknown, replay could duplicate irreversible side effects, or dead-letter retention cannot meet investigation needs.