# Streaming Feature Pipelines

## Purpose
Compute low-latency features from event streams while controlling disorder, duplicates, state and recovery.

## When to use
Use when feature freshness cannot be met by batch processing.

## Inputs
Event schema, keys, timestamps, latency target, expected throughput, disorder window and state retention.

## Context to inspect
Broker guarantees, partitioning, consumer groups, checkpointing, watermarking, state backend and online store writes.

## Core knowledge
Streaming correctness depends on event-time semantics, duplicate tolerance, state bounds and replay behavior. Exactly-once claims are end-to-end properties, not broker labels.

## Procedure
1. Define freshness and correctness requirements.
2. Validate event key and event timestamp.
3. Choose partitioning that preserves required per-entity ordering.
4. Define watermark and late-event policy.
5. Implement bounded windows/state.
6. Make sink updates idempotent or version-aware.
7. Configure checkpoint/recovery behavior.
8. Add dead-letter handling for invalid events.
9. Test duplicates, reorderings, delays and replay.
10. Load-test sustained and burst traffic.
11. Monitor lag, watermark delay, state size and sink errors.

## Decision points
Choose streaming only when latency value justifies operational complexity. Drop, correct, or recompute late events according to business semantics.

## Common failure patterns
Unbounded state, hot partitions, processing-time leakage, non-idempotent sinks, silent late-data loss and replay corruption.

## Verification
Replay a controlled event set and prove identical terminal feature state; validate latency under peak load.

## Expected output
A recoverable streaming feature pipeline with explicit temporal guarantees.

## Stop conditions
Stop when ordering, replay, or sink consistency guarantees cannot meet the feature contract.