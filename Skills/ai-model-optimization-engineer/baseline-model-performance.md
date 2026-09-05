# Baseline Model Performance

## Purpose
Establish a trustworthy quality, latency, throughput, memory, and cost baseline before optimization.

## When to use
Before changing model architecture, precision, serving configuration, kernels, batching, or hardware.

## Inputs
Model artifact, representative workloads, quality metrics, serving stack, hardware, traffic profile, SLOs, cost data.

## Preconditions
Pin model/version, software stack, hardware class, dataset version, and benchmark configuration.

## Context to inspect
Review inference path, preprocessing/postprocessing, request shapes, sequence lengths, concurrency, accelerators, telemetry, and current bottlenecks.

## Core knowledge
Optimization is comparative. A faster system that silently degrades task quality, tail latency, reliability, or cost under realistic load is not necessarily better. Warmup, caching, dynamic shapes, and synchronization can distort measurements.

## Procedure
1. Define acceptance metrics and constraints.
2. Select representative and stress workloads.
3. Warm the runtime consistently.
4. Measure task quality and calibration where relevant.
5. Measure p50/p95/p99 latency, throughput, memory, utilization, and cost.
6. Separate preprocessing, model execution, transfer, and postprocessing time.
7. Repeat runs and quantify variance.
8. Record environment and artifacts.
9. Identify the dominant limiting resource.
10. Freeze the baseline for later comparisons.

## Decision points
Use offline benchmarks for kernel/model analysis and load tests for service behavior. Optimize throughput or latency according to the actual SLO, not whichever metric is easiest.

## Common failure patterns
Benchmarking toy inputs, omitting warmup, reporting averages only, asynchronous timing errors, changing multiple variables, ignoring quality regression.

## Verification
A second run from the recorded configuration reproduces results within an agreed tolerance and captures tail behavior under representative load.

## Expected output
Versioned benchmark report, bottleneck hypothesis, reproducible commands/configuration, and optimization target.

## Stop conditions
Stop if representative data, quality criteria, hardware access, or stable measurement conditions are unavailable.