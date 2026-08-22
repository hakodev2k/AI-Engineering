# Distributed Systems Design

## Purpose
Design distributed components with explicit assumptions about failure, latency, consistency, coordination, and operability.

## When to use
Use when software spans multiple processes, services, regions, or independently failing dependencies.

## Inputs
Service topology, NFRs, data ownership, consistency needs, failure history, network constraints, traffic patterns.

## Context to inspect
Call graphs, synchronous chains, retries, timeouts, queues, replication, clocks, leader election, idempotency, and observability.

## Core knowledge
Networks are unreliable; partial failure is normal. Distribution introduces latency, duplicate delivery, reordering, split brain, stale reads, and coordination cost. Strong guarantees should be used only where business invariants require them.

## Procedure
1. Map components and communication paths.
2. Identify failure and partition scenarios.
3. Define consistency requirements per workflow.
4. Minimize synchronous dependency chains.
5. Set timeout, retry, backoff, and idempotency policies.
6. Define ownership and recovery for durable state.
7. Design for duplicate, delayed, and out-of-order messages.
8. Add correlation, metrics, and tracing.
9. Validate behavior under injected failures.

## Decision points
Choose synchronous calls for immediate coupling and simple semantics; asynchronous messaging for decoupling and tolerance of delay. Choose strong consistency only for invariants that cannot tolerate temporary divergence.

## Common failure patterns
Infinite retries, distributed transactions by default, hidden shared databases, missing idempotency, long sync chains, and assuming exactly-once delivery.

## Verification
Run failure scenarios for unavailable dependencies, duplicate messages, timeouts, partitions, and recovery.

## Expected output
A failure-aware distributed design with explicit consistency and recovery semantics.

## Stop conditions
Stop if required consistency guarantees or failure tolerance cannot be reconciled with available infrastructure.