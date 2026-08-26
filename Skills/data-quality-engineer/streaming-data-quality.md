# Streaming Data Quality

## Purpose
Validate continuously arriving event data while respecting event-time semantics, ordering, duplication, lateness, and distributed processing failure modes.

## When to use
Use for Kafka-like streams, CDC, telemetry, event-driven analytics, and real-time feature pipelines.

## Inputs
Event contract, keys, partitions, timestamps, delivery semantics, watermark policy, consumer SLOs, and replay behavior.

## Preconditions
Understand broker and processor guarantees; do not assume exactly-once business effects from platform terminology alone.

## Context to inspect
Inspect producers, serialization, partitioning, offsets, retries, DLQs, watermarking, deduplication, state stores, schema registry, and replay procedures.

## Core knowledge
Streaming quality must account for duplicates, out-of-order events, late arrivals, poison messages, schema drift, and partial processing. Event-time and processing-time correctness differ.

## Procedure
1. Define event identity and contract.
2. Validate schema and required semantics at ingress.
3. Measure malformed, duplicate, and late-event rates.
4. Define ordering expectations per key.
5. Configure lateness/watermark policy from business tolerance.
6. Design deduplication with bounded state.
7. Route poison events to controlled quarantine/DLQ.
8. Monitor lag, throughput, and state growth.
9. Test replay and consumer restart behavior.
10. Reconcile stream outputs with authoritative aggregates periodically.
11. Document correction semantics for late or amended events.

## Decision points
Choose at-least-once plus idempotency when simpler than transactional processing. Drop late events only when business semantics permit; otherwise update prior results. Use DLQs for inspectable exceptional events, not as silent data loss.

## Common failure patterns
Global ordering assumptions; unbounded dedup state; treating broker delivery as business exactly-once; never replaying DLQs; watermark too aggressive; schema compatibility without semantic checks.

## Verification
Inject duplicates, reordering, malformed records, late events, and restarts. Confirm expected outputs, bounded state, recoverability, and reconciliation.

## Expected output
Streaming controls for contract validation, lateness, duplicates, ordering, quarantine, replay, metrics, and reconciliation.

## Stop conditions
Stop when event identity is undefined, correction semantics are unknown, or replay could trigger unsafe external side effects.