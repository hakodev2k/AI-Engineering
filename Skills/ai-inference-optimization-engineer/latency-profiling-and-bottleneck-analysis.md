# Latency Profiling and Bottleneck Analysis

## Purpose
Identify the dominant contributors to inference latency and prove which subsystem should be optimized first.

## When to use
Use for slow requests, latency regressions, poor scaling, or before major optimization work.

## Inputs
Representative requests, traces, profiler output, runtime metrics, model configuration, hardware topology, and latency SLOs.

## Context to inspect
Inspect queueing, tokenization, host-to-device transfer, prefill, decode, collective communication, postprocessing, streaming, network, retries, and downstream dependencies.

## Core knowledge
End-to-end latency is a composition of sequential and overlapping stages. GPU utilization alone does not identify the bottleneck. Time-to-first-token and inter-token latency represent different user experiences and often different limiting resources.

## Procedure
1. Reproduce the slowdown with a representative request cohort.
2. Capture end-to-end distributed traces and device-level profiler data.
3. Break latency into queue, preprocessing, prefill, decode, postprocessing, and transport.
4. Measure time-to-first-token and inter-token latency separately.
5. Correlate slow spans with accelerator, CPU, memory, and network metrics.
6. Compare healthy and degraded traces.
7. Form one bottleneck hypothesis at a time.
8. Change a single relevant variable and rerun the benchmark.
9. Quantify end-to-end improvement, not only local-stage speedup.
10. Record residual bottlenecks and the new limiting resource.

## Decision points
Optimize the largest controllable contributor first. Address queueing before kernels when the system is overloaded. Address host or network paths before adding accelerators when devices are waiting on input.

## Common failure patterns
Guessing from utilization, profiling synthetic shapes only, comparing different traffic conditions, focusing on averages, and celebrating microbenchmarks that do not improve user-visible latency.

## Verification
A before/after trace must show the targeted stage shrinking and end-to-end latency improving under equivalent workload conditions.

## Expected output
A bottleneck report with trace evidence, ranked causes, experiments, and measured outcomes.

## Stop conditions
Stop when the issue cannot be reproduced, traces are incomplete, production-only evidence requires unauthorized access, or workload conditions cannot be held comparable.