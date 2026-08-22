# Event-Driven Architecture

## Purpose
Design event-driven systems that gain loose coupling without losing semantic clarity, consistency, recoverability, or operability.

## When to use
Use when business events must fan out, workloads need buffering, systems require temporal decoupling, or workflows span independently owned components.

## Inputs
Domain events, consumers, throughput, ordering requirements, delivery guarantees, retention, consistency needs.

## Preconditions
Event ownership and business meaning are explicit.

## Context to inspect
Broker capabilities, schemas, partitioning, consumer groups, retention, retries, DLQs, replay strategy, observability, transaction boundaries.

## Core knowledge
Most practical messaging is at-least-once. Consumers must tolerate duplicates. Ordering is usually scoped, not global. Events should communicate facts, not hidden remote procedure calls.

## Procedure
1. Identify meaningful business events and owners.
2. Define immutable event semantics and schema.
3. Choose partition keys and ordering scope.
4. Design producer atomicity, often using outbox patterns where needed.
5. Require idempotent consumer behavior.
6. Define retry, poison-message, DLQ, and replay policy.
7. Model eventual-consistency windows.
8. Define schema evolution and compatibility.
9. Add correlation, metrics, lag monitoring, and traceability.
10. Test duplicate, delayed, reordered, replayed, and failed delivery scenarios.

## Decision points
Use events for facts that multiple consumers may react to. Prefer commands for directed intent. Avoid event-driven design when synchronous consistency is the dominant requirement and distribution adds no value.

## Common failure patterns
Event-as-RPC, shared mutable schemas, no replay plan, global ordering assumptions, non-idempotent consumers, unbounded retries.

## Verification
Replay and failure tests prove recoverability without duplicated business effects.

## Expected output
Event model, delivery semantics, recovery strategy, and operational controls.

## Stop conditions
Stop when business cannot tolerate eventual consistency but no coordination strategy exists.