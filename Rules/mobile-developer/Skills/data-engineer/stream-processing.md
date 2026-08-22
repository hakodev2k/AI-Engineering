# Stream Processing

## Purpose
Build event-processing pipelines with explicit delivery, ordering, state, latency, and recovery semantics.

## When to use
Use when data must be processed continuously or latency requirements make periodic batch insufficient.

## Inputs
Event contracts, producers, consumers, throughput, latency target, ordering needs, retention, and failure requirements.

## Context to inspect
Inspect broker guarantees, partition keys, event-time fields, replay capability, consumer state, sink idempotency, and schema registry practices.

## Core knowledge
Understand event time versus processing time, partitions, consumer offsets, watermarks, windows, late events, at-least-once delivery, deduplication, state stores, backpressure, and replay.

## Procedure
1. Define event meaning and ownership.
2. Establish partition and ordering requirements.
3. Choose delivery semantics based on business effects.
4. Define event-time, lateness, and window behavior.
5. Design idempotent or deduplicated sink writes.
6. Bound state and retention.
7. Handle poison events without blocking partitions indefinitely.
8. Instrument lag, throughput, failures, and state growth.
9. Test replay, rebalance, duplicate, late, and out-of-order events.
10. Document operational recovery.

## Decision points
Prefer at-least-once plus idempotency over fragile claims of end-to-end exactly-once unless the entire path supports it. Choose partition keys for required ordering, not arbitrary load distribution alone.

## Common failure patterns
Assuming global order, ignoring late events, side effects that duplicate on retry, unbounded state, incompatible schema changes, and treating broker acknowledgement as business completion.

## Verification
Replay a representative range, inject duplicates and disorder, verify sink invariants, measure lag under peak load, and confirm state remains bounded.

## Expected output
A documented streaming topology with explicit correctness, ordering, replay, state, and operational semantics.

## Stop conditions
Escalate when business requirements demand guarantees unsupported by the broker or sink, or event contracts cannot be stabilized.