# SQS, SNS, and EventBridge Messaging

## Purpose
Design decoupled asynchronous systems on AWS with explicit delivery, ordering, retry, and failure semantics.

## When to use
Use for queues, fan-out, event buses, integration workflows, backpressure, or retry isolation.

## Inputs
Producer/consumer contracts, throughput, ordering, duplication tolerance, latency, failure handling, replay needs, retention.

## Context to inspect
Queues/topics/buses, subscriptions, DLQs, redrive policies, visibility timeout, FIFO settings, filters, IAM/resource policies, metrics.

## Core knowledge
Most AWS messaging is at-least-once; consumers must tolerate duplicates. Visibility timeout must exceed normal processing with margin. EventBridge excels at routing events; SQS provides durable consumer backpressure; SNS provides push fan-out.

## Procedure
1. Define event/message ownership and schema.
2. Choose SQS, SNS, EventBridge, or composition based on semantics.
3. Set retention and visibility timeout from processing characteristics.
4. Implement idempotent consumers.
5. Configure bounded retries and DLQ/redrive.
6. Use filtering to reduce unnecessary deliveries.
7. Define ordering only where business rules truly require it.
8. Add correlation IDs and structured failure metadata.
9. Monitor queue age, depth, DLQ count, and consumer errors.
10. Test duplicate, poison-message, backlog, and dependency-outage scenarios.

## Decision points
Use FIFO only when ordering/deduplication requirements justify throughput/complexity trade-offs. Prefer queues between producers and slow or failure-prone consumers.

## Common failure patterns
Infinite retries, too-short visibility timeout, non-idempotent consumers, DLQs nobody watches, and event schemas changed without compatibility discipline.

## Verification
Inject duplicates and poison messages, pause consumers, verify redrive, and measure recovery from backlog.

## Expected output
Messaging topology, contracts, retry policy, and recovery evidence.

## Stop conditions
Escalate when delivery semantics are ambiguous or ordering requirements conflict with required throughput.