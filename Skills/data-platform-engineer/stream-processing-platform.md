# Stream Processing Platform

## Purpose
Design and operate stream-processing capabilities with explicit event-time semantics, state management, delivery guarantees, and failure recovery.

## When to use
Use when continuous processing materially improves latency or responsiveness. Do not use streaming solely for architectural fashion.

## Inputs
Event contracts, throughput, latency SLOs, ordering requirements, state size, lateness expectations, retention, and downstream semantics.

## Context to inspect
Brokers, partitions, consumer groups, checkpoints, state stores, watermark configuration, serializers, sink behavior, lag, and historical failures.

## Core knowledge
Event time differs from processing time. Stateful processing requires durable checkpoints and compatible state evolution. End-to-end correctness depends on source, processor, and sink semantics together.

## Procedure
1. Define event identity, keys, timestamps, ordering, and schema rules.
2. Establish latency and correctness SLOs.
3. Choose partitioning that balances ordering and parallelism.
4. Define watermark and late-event policy from business tolerance.
5. Bound state and specify expiration.
6. Configure checkpointing and recovery.
7. Make sinks transactional or idempotent.
8. Define poison-event and dead-letter handling.
9. Add lag, throughput, checkpoint, state-size, and freshness telemetry.
10. Test rebalances, duplicates, broker loss, processor restart, late data, and sink outages.
11. Document replay and state migration procedures.

## Decision points
Use event-time windows when business meaning depends on occurrence time; processing-time windows are simpler when arrival time is sufficient. Increase partitions for throughput only after checking key skew and ordering constraints.

## Common failure patterns
Unbounded state, hot keys, incorrect watermarking, assuming exactly-once across non-transactional sinks, incompatible state upgrades, replay storms, and silent consumer lag.

## Verification
Inject duplicates and out-of-order events; restart processors; restore checkpoints; validate aggregate invariants; measure recovery time and sustained lag under peak load.

## Expected output
Stream topology, semantics specification, state/recovery design, tests, dashboards, alerts, and replay runbook.

## Stop conditions
Escalate when event identity is ambiguous, state cannot be recovered safely, sink semantics cannot meet correctness requirements, or replay could produce irreversible effects.