# Event Stream Architecture

## Purpose
Design durable event-streaming systems with explicit ownership, ordering, delivery, and evolution guarantees.

## When to use
Use for new streaming platforms, major topology changes, or reviews of unreliable event flows. Do not use streaming when synchronous request/response or batch processing better matches the business latency requirement.

## Inputs
Business workflow, producers/consumers, latency and durability SLOs, expected throughput, failure semantics, compliance constraints.

## Context to inspect
Existing brokers, schemas, partitioning, consumer groups, retention, replay procedures, observability, downstream dependencies.

## Core knowledge
Streams are durable ordered logs, not RPC. Architecture must make delivery semantics, ownership, partition keys, retention, replay, backpressure, and schema evolution explicit. End-to-end exactly-once is conditional and expensive; idempotency is usually still required.

## Procedure
1. Map business events and owners.
2. Classify commands, facts, state changes, and derived events.
3. Define latency, durability, ordering, retention, and replay requirements.
4. Choose broker and topology from measured requirements.
5. Define partitioning and consumer-group strategy.
6. Define schemas and compatibility rules.
7. Design retry, dead-letter, idempotency, and recovery paths.
8. Add security and data-governance controls.
9. Define SLOs, metrics, alerts, and runbooks.
10. Validate with load, failure, and replay tests.

## Decision points
Prefer event streaming for decoupled asynchronous state propagation and replayable history; prefer queues for work distribution and synchronous APIs for immediate request outcomes. Choose ordering scope only as broad as business invariants require.

## Common failure patterns
Treating events as mutable RPC payloads; global ordering requirements; hot partitions; hidden coupling; unbounded retries; missing replay plan; no schema governance.

## Verification
Demonstrate required throughput and latency, controlled broker/consumer failure recovery, deterministic replay, compatible schema change, and observable lag/error behavior.

## Expected output
Architecture decision, topology, contracts, failure model, SLOs, and operational runbook.

## Stop conditions
Escalate when business invariants, data ownership, regulatory retention, or delivery semantics are unresolved.