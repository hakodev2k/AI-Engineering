# Inference Performance Tuning

## Purpose
Systematically improve inference latency, throughput, and accelerator efficiency without violating correctness or SLOs.

## When to use
Use for slow, expensive, or underutilized inference services.

## Inputs
Latency histograms, throughput, GPU/CPU metrics, model profile, batch/concurrency settings, request traces.

## Context to inspect
Runtime, precision, kernels, batching, queueing, serialization, network path, model load behavior, memory use, and autoscaling.

## Core knowledge
Performance depends on compute intensity, memory bandwidth, kernel efficiency, batching, request shape, host-device transfer, and queueing behavior. Tail latency matters more than averages for online systems.

## Procedure
1. Reproduce the workload with representative traffic.
2. Establish a baseline for p50/p95/p99 latency, throughput, utilization, and cost.
3. Separate queueing, preprocessing, model execution, and postprocessing time.
4. Profile CPU, GPU kernels, memory, and transfer overhead.
5. Test batching, concurrency, precision, compilation, and caching changes independently.
6. Re-measure tail latency and correctness after each change.
7. Validate behavior under burst and autoscaling events.
8. Record the chosen operating envelope.

## Decision points
Increase batching when throughput dominates and latency budget allows. Quantize or compile only when model-quality and compatibility checks pass.

## Common failure patterns
Optimizing averages, benchmarking synthetic tiny requests, hiding queueing time, increasing concurrency until OOM, and changing multiple variables at once.

## Verification
Compare before/after benchmark distributions, model outputs, resource utilization, and cost per request.

## Expected output
A measured tuning report and production-safe configuration.

## Stop conditions
Stop when representative workload data or correctness criteria are unavailable.