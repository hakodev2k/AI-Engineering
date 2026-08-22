# Queue and Messaging Failures

## Purpose
Validate resilience and correctness when brokers, consumers, producers, acknowledgements, or message delivery degrade.

## When to use
Use for event-driven systems, queues, streams, and background processing.

## Inputs
Messaging topology, delivery semantics, retry/dead-letter policy, idempotency controls, and throughput expectations.

## Context to inspect
Inspect partitions, consumer groups, acknowledgements, visibility timeouts, ordering, poison-message handling, retention, and backpressure.

## Core knowledge
Messaging systems commonly provide at-least-once delivery, making duplicates and delayed processing normal failure cases. Backlog recovery can itself overload dependencies.

## Procedure
1. Define message-processing invariants and acceptable lag.
2. Select a broker or consumer failure.
3. Capture baseline throughput and lag.
4. Inject bounded unavailability, redelivery, or consumer loss.
5. Observe backlog, duplicates, ordering, and dead letters.
6. Restore capacity and measure catch-up behavior.
7. Validate downstream load and final data state.

## Decision points
Prefer idempotent consumers over assumptions of exactly-once delivery. Throttle backlog recovery when downstream capacity is lower than catch-up demand.

## Common failure patterns
Infinite poison retries, duplicate side effects, hidden backlog, retention expiry, partition hotspots, and recovery storms.

## Verification
Confirm no unacceptable loss, duplicates are safely handled, lag recovers, and dead-letter behavior is observable.

## Expected output
Evidence of messaging resilience and recovery limits.

## Stop conditions
Stop when retention/data-loss thresholds are approached or catch-up threatens shared dependencies.