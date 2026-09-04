# Inference Throughput and Latency

## Purpose
Optimize GPU inference for the required balance of throughput, median latency, tail latency, memory, and cost rather than maximizing a single benchmark number.

## When to use
Use when serving models under request concurrency, selecting batch policies, diagnosing latency spikes, or comparing inference engines and execution strategies.

## Inputs
- Request-size and arrival distributions
- SLOs for latency and throughput
- Model shapes and precision
- Batch/concurrency settings
- GPU memory and utilization metrics

## Context to inspect
Inspect preprocessing, queueing, dynamic batching, graph compilation, KV/cache usage where relevant, kernel launches, transfer overhead, synchronization, and scheduler behavior.

## Core knowledge
Throughput and latency frequently trade off. Larger batches improve arithmetic efficiency but add queueing and memory pressure. Tail latency may be dominated by scheduling, shape variance, cache behavior, or contention rather than average kernel time.

## Procedure
1. Define target percentiles and sustainable request rate.
2. Reproduce production-like arrival and shape distributions.
3. Decompose queueing, CPU, transfer, GPU, and postprocessing time.
4. Sweep batch size, dynamic-batch window, and concurrency.
5. Profile dominant operators and launch gaps.
6. Evaluate graph capture/compilation and optimized libraries where compatible.
7. Tune precision and memory layout with quality validation.
8. Test saturation behavior and overload protection.
9. Measure p50/p95/p99 latency, throughput, utilization, memory, and cost per request.
10. Select the configuration that meets SLOs with operational headroom.

## Decision points
Favor smaller batches for strict latency; larger or dynamic batches for throughput when queueing budget permits. Add replicas when latency degrades near saturation. Optimize kernels only after queueing/orchestration effects are understood.

## Common failure patterns
- Benchmarking fixed batches unlike production traffic
- Reporting averages without tail latency
- Driving utilization to 100% and eliminating SLO headroom
- Ignoring warm-up/compilation
- Throughput gains that increase cost due to fragmentation or underfilled replicas

## Verification
Run sustained load tests including bursts, verify SLOs and correctness, and confirm performance remains stable after warm-up and over long-lived processes.

## Expected output
A serving-performance configuration with workload assumptions, SLO evidence, saturation point, bottleneck analysis, and capacity headroom.

## Stop conditions
Stop when required SLOs cannot be met on target hardware without architectural or capacity changes requiring owner approval.