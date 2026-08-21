# Distributed Systems Failure Analysis

## Purpose
Diagnose failures that emerge from timing, partial availability, concurrency, replication, and cross-service interactions rather than a single broken component.

## When to use
Use for intermittent production failures, split-brain behavior, duplicate processing, stale reads, cross-service timeouts, retry storms, or incidents that cannot be explained by local component health alone.

## Inputs
Distributed traces, logs, topology, message flow, clocks/timestamps, retry policies, consistency model, replication state, queue behavior, and incident timeline.

## Preconditions
Correlation identifiers and enough temporal evidence must exist to reconstruct at least part of the interaction sequence.

## Context to inspect
Network boundaries, retries, timeouts, leader election, replication, queues, caches, service discovery, DNS, clock skew, connection reuse, transaction boundaries, and idempotency mechanisms.

## Core knowledge
Distributed systems experience partial failure, delayed messages, reordered events, duplicated delivery, stale state, asymmetric partitions, and independent component recovery. Local health does not prove end-to-end correctness. Failure analysis must reason about sequences and state transitions.

## Procedure
1. Define the user-visible invariant that failed.
2. Reconstruct the cross-service timeline using traces and logs.
3. Identify message/request boundaries and deadlines.
4. Check whether retries created duplicate or overlapping work.
5. Inspect replication, cache, and queue state at the incident time.
6. Evaluate network or discovery failures that may be asymmetric.
7. Compare observed behavior with documented consistency assumptions.
8. Test the smallest plausible interaction failure in a controlled environment.
9. Add instrumentation where the causal sequence is unobservable.
10. Implement containment before optimizing architecture.
11. Verify recovery under delayed, duplicate, and partial-failure scenarios.

## Decision points
Prefer idempotency and reconciliation over attempting impossible exactly-once guarantees. Use stronger consistency when violated invariants cause unacceptable harm; accept eventual consistency only when stale states are bounded and repairable.

## Common failure patterns
Blaming the last error log, assuming request order equals event order, ignoring clock skew, treating retries as harmless, reasoning from one service in isolation, and confusing availability with consistency.

## Verification
Replay or simulate the causal sequence and confirm the fix preserves invariants across duplicate, delayed, reordered, and partially failed interactions.

## Expected output
Evidence-backed failure sequence, violated assumption, containment, durable remediation, and added observability where needed.

## Stop conditions
Escalate when data corruption is possible, authoritative event order cannot be established, or remediation changes core consistency semantics.