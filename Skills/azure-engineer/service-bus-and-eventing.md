# Service Bus and Eventing

## Purpose
Design Azure messaging and event flows that decouple systems while handling retries, duplicates, ordering, throughput, and poison messages safely.

## When to use
Use for Service Bus queues/topics, Event Grid, Event Hubs, asynchronous integration, and message-processing incidents.

## Inputs
Producer/consumer behavior, delivery guarantees, ordering needs, event rate, payload size, retention, failure semantics, and replay requirements.

## Context to inspect
Inspect namespaces, queues/topics/subscriptions, filters, locks, dead-letter queues, duplicate detection, sessions, Event Grid subscriptions, Event Hubs partitions, consumer groups, retries, and metrics.

## Core knowledge
Service Bus suits commands/work queues and brokered messaging; Event Grid suits event notification/routing; Event Hubs suits high-throughput streams. Most systems must tolerate at-least-once delivery.

## Procedure
1. Classify the interaction as command, work item, notification, or stream.
2. Choose the Azure messaging service based on semantics, not familiarity.
3. Define message contracts and versioning.
4. Design idempotent consumers.
5. Configure lock duration, retries, backoff, and dead-letter behavior.
6. Add sessions/ordering only when the business requirement justifies throughput constraints.
7. Set capacity, partitions, or throughput units from load estimates and tests.
8. Secure producers/consumers with scoped identities.
9. Add correlation and operational metrics.
10. Test duplicate, delayed, poison, burst, and consumer-outage scenarios.

## Decision points
Use queues for competing consumers, topics for fan-out, Event Grid for lightweight event routing, and Event Hubs for telemetry/streams. Do not require global ordering unless business semantics truly demand it.

## Common failure patterns
Exactly-once assumptions, unbounded retries, no DLQ owner, oversized messages, shared connection secrets, hidden contract breaking changes, and retry storms during downstream outages.

## Verification
Inject duplicate and poison messages, stop consumers, create bursts, inspect DLQ/replay behavior, and verify unauthorized identities cannot send or receive.

## Expected output
A messaging design with explicit delivery semantics, contracts, capacity, failure handling, security, and replay procedures.

## Stop conditions
Stop when side effects cannot be made idempotent, message ownership is unclear, or required ordering/transaction guarantees cannot be met by the chosen service.