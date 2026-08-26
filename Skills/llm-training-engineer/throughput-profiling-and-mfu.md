# Throughput Profiling and MFU

## Purpose
Identify where training time is spent and improve useful model FLOP utilization without compromising correctness.

## When to use
Use before large-scale launches, after topology/model changes, or when tokens/sec regresses.

## Inputs
Profiler traces, model FLOP estimate, step timing, accelerator specs, topology, batch/sequence config, kernel versions.

## Context to inspect
Compute kernels, collective communication, pipeline bubbles, input stalls, recomputation, memory bandwidth, synchronization, checkpoint overhead.

## Core knowledge
MFU is useful only with a consistent FLOP definition. Throughput must be compared at matched model, sequence, batch, precision, and objective. A faster step that processes fewer useful tokens is not necessarily better.

## Procedure
1. Define useful-token throughput and FLOP accounting.
2. Capture a stable baseline after warmup.
3. Profile representative steps, not initialization.
4. Attribute time to compute, communication, data, idle and I/O.
5. Identify the largest bounded bottleneck.
6. Change one major factor at a time.
7. Re-profile and measure end-to-end gain.
8. Check memory headroom and numerical equivalence.
9. Repeat until gains no longer justify complexity.

## Decision points
Optimize kernels when compute-bound; topology/parallelism when communication-bound; loader/storage when input-bound. Use recomputation when memory savings enable a net throughput benefit despite extra FLOPs.

## Common failure patterns
Quoting peak FLOPs as achieved; profiling startup; changing batch size during comparison; optimizing microbenchmarks that do not improve end-to-end tokens/sec.

## Verification
Profiler attribution explains step time, tokens/sec and MFU calculations reconcile, and optimized runs preserve training trajectory within tolerance.

## Expected output
A bottleneck report with reproducible baseline, traces, changes, and measured end-to-end gains.

## Stop conditions
Stop optimization when correctness changes, gains fall below engineering cost, or the next bottleneck requires unsupported infrastructure changes.