# Inference Optimization and Acceleration

## Purpose
Reduce vision inference latency, memory, and compute cost while preserving verified model behavior.

## When to use
Use when a validated model misses serving budgets or must run on constrained hardware.

## Inputs
Model artifact, representative inputs, target hardware, latency/throughput/memory limits, quality tolerances.

## Preconditions
An unoptimized baseline is reproducible and correct.

## Context to inspect
Operator support, tensor shapes, preprocessing, post-processing, precision, batching, accelerators, runtime versions.

## Core knowledge
Optimization must be measured end to end. Export, fusion, quantization, compilation, and batching can alter numerical behavior or move bottlenecks elsewhere.

## Procedure
1. Profile end-to-end latency and stage costs.
2. Remove avoidable host-side copies and synchronization.
3. Export through a supported stable graph.
4. Benchmark optimized runtimes on target hardware.
5. Evaluate mixed precision or quantization using representative calibration data.
6. Compare numerical and task-level outputs to baseline.
7. Tune batch size/concurrency for workload shape.
8. Re-profile memory, latency tails, and throughput.

## Decision points
FP32 vs FP16/BF16 vs INT8; static vs dynamic shapes; batching vs low single-request latency.

## Common failure patterns
Benchmarking only kernel time, unsupported operator fallback, inaccurate quantization calibration, throughput gains that worsen tail latency.

## Verification
Run parity tests, full evaluation metrics, warm/cold latency distributions, throughput, and peak memory measurements.

## Expected output
Optimized artifact, runtime configuration, benchmark evidence, and quality delta.

## Stop conditions
Stop when required quality cannot be preserved or target hardware/runtime lacks safe operator support.