# Online Model Serving

## Purpose
Serve predictions with controlled latency, availability, compatibility and resource usage.

## When to use
Use when decisions require request-time predictions or fresher features than batch scoring provides.

## Inputs
Model artifact, request/response contract, latency SLO, traffic profile, feature dependencies and infrastructure limits.

## Context to inspect
Serialization, preprocessing, concurrency model, autoscaling, network dependencies and fallback behavior.

## Core knowledge
Serving performance includes preprocessing, feature retrieval, model execution and postprocessing. Tail latency and dependency failure dominate many production incidents.

## Procedure
1. Define stable typed request/response schemas.
2. Package preprocessing with the model.
3. Benchmark cold and warm inference.
4. Bound request size and concurrency.
5. Configure timeouts and resource limits.
6. Avoid retries for non-idempotent downstream actions; isolate prediction retries where safe.
7. Add readiness/liveness semantics that reflect real dependencies.
8. Implement fallback or graceful degradation where justified.
9. Emit latency, error, saturation and model-version telemetry.
10. Load-test before rollout.

## Decision points
Use synchronous serving only when the caller needs immediate results. Choose CPU/GPU and batching based on measured throughput-latency-cost curves.

## Common failure patterns
Unbounded queues, model loaded per request, train-serving preprocessing drift, retry storms, no model-version logging and averages hiding p99 latency.

## Verification
Contract tests, load tests, failure injection and resource profiling must meet SLOs with representative payloads.

## Expected output
A production-ready serving path with measured SLO compliance and fallback behavior.

## Stop conditions
Stop rollout if tail latency, error rate, schema compatibility or resource headroom fails acceptance criteria.