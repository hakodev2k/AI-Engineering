# Online Model Serving

## Purpose
Serve predictions reliably under latency, throughput, availability, and compatibility constraints.

## When to use
When decisions require synchronous or near-real-time inference.

## Inputs
Model package, request/response contract, SLOs, traffic profile, infrastructure, feature dependencies.

## Context to inspect
Cold start, concurrency, serialization, feature lookup latency, CPU/GPU needs, autoscaling, timeouts, fallback behavior.

## Core knowledge
End-to-end latency includes preprocessing and dependencies, not only model compute. Serving must preserve train-serving transformation parity and degrade predictably.

## Procedure
1. Define schema, SLOs, error behavior, and maximum payloads.
2. Package model and preprocessing immutably.
3. Validate inputs before inference.
4. Benchmark warm/cold latency and throughput.
5. Configure concurrency, resource requests, scaling, and timeouts.
6. Add health/readiness checks and structured telemetry.
7. Define dependency and overload fallbacks.
8. Load-test representative traffic.
9. Roll out progressively and verify live behavior.

## Decision points
Use CPU unless GPU materially improves cost/SLO. Prefer asynchronous/batch inference if interactive latency is not required.

## Common failure patterns
Benchmarking model compute alone, unbounded queues, schema drift, synchronous slow feature calls, and scaling on CPU when queue latency is the real signal.

## Verification
Load tests satisfy percentile SLOs and failure tests demonstrate bounded, observable degradation.

## Expected output
A production-ready serving contract and deployment configuration.

## Stop conditions
Block launch when SLOs, compatibility, capacity, or rollback behavior are unverified.