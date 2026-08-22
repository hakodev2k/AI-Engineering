# CPU Profiling

## Purpose
Identify where CPU time is consumed and distinguish useful computation from contention, spin, serialization, runtime overhead, and inefficient algorithms.

## When to use
Use when CPU saturation, high compute cost, throughput limits, or CPU-correlated latency is observed.

## Inputs
Representative workload, profiler access, symbols/build metadata, runtime metrics, traces, and baseline CPU utilization.

## Context to inspect
Inspect process/container limits, thread counts, runtime/JIT behavior, hot endpoints, serialization, compression, crypto, parsing, loops, and lock contention.

## Core knowledge
CPU utilization alone does not identify a hot path. Sampling profilers usually have lower distortion than instrumentation. Inclusive and exclusive time answer different questions, and wall time includes waiting.

## Procedure
1. Reproduce the CPU-heavy workload.
2. Confirm the process is actually CPU constrained rather than throttled or waiting.
3. Capture a representative CPU profile.
4. Inspect hottest stacks by inclusive and self time.
5. Separate application code, runtime, kernel, and dependency client overhead.
6. Check for algorithmic amplification and repeated work.
7. Inspect contention/spin and excessive concurrency.
8. Form a hypothesis and change one significant hot path.
9. Benchmark the change under equivalent conditions.
10. Validate end-to-end latency/throughput and CPU efficiency.

## Decision points
Optimize algorithms before micro-optimizing instructions when complexity dominates. Cache computation only when invalidation, memory, and staleness costs are acceptable.

## Common failure patterns
Profiling idle periods, optimizing tiny self-time frames, reading wall-clock traces as CPU profiles, ignoring throttling, and claiming improvement from CPU reduction that worsens latency.

## Verification
Show reduced CPU per unit of useful work and improved or unchanged user-facing performance under the same workload.

## Expected output
A profile-backed CPU bottleneck analysis and verified optimization result.

## Stop conditions
Stop if representative reproduction is unavailable or profiler overhead materially changes the behavior being diagnosed.