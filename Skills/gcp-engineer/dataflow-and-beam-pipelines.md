# Dataflow and Beam Pipelines

## Purpose
Build and operate scalable batch and streaming pipelines with Apache Beam on Dataflow using correct windows, state, autoscaling, and data-quality controls.

## When to use
Use for high-volume ETL, streaming transformations, event-time processing, or managed Beam execution.

## Inputs
Sources, sinks, schema, throughput, lateness tolerance, state requirements, SLAs, and replay strategy.

## Context to inspect
Beam graph, windowing, triggers, watermarks, state/timers, shuffle, worker sizing, autoscaling, templates, and sink limits.

## Core knowledge
Streaming correctness depends on event time, watermarks, windows, triggers, and idempotent sink semantics. Dataflow optimization should follow stage-level metrics rather than guesswork.

## Procedure
1. Define data contract and correctness semantics.
2. Separate event time from processing time.
3. Choose windows and lateness policy.
4. Design deduplication/state carefully.
5. Bound expensive transforms and side inputs.
6. Select worker and autoscaling strategy.
7. Protect downstream systems from burst throughput.
8. Add data-quality counters and dead-letter outputs.
9. Load test representative skew and late data.
10. Validate replay and update strategy.

## Decision points
Use streaming only when latency requirements justify continuous cost. Prefer managed templates for standardized patterns.

## Common failure patterns
Unbounded state, hot keys, oversized side inputs, ignoring watermark stalls, and non-idempotent sinks.

## Verification
Compare expected counts, inspect stage metrics, simulate skew/late data, and test replay without corruption.

## Expected output
A measurable, replay-safe Beam/Dataflow pipeline.

## Stop conditions
Stop when source replay or sink idempotency cannot be defined.