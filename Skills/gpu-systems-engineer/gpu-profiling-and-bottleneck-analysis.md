# GPU Profiling and Bottleneck Analysis

## Purpose
Turn GPU performance symptoms into evidence-backed root causes using timelines, hardware counters, and controlled experiments.

## When to use
Use for latency regressions, low throughput, low accelerator utilization, scaling loss, or expensive kernels.

## Inputs
Representative workload, profiler access, hardware/software versions, baseline metrics, traces, kernel names, topology.

## Preconditions
Stabilize clocks/workload where possible and separate warm-up from measurement.

## Context to inspect
Inspect CPU launch activity, GPU timelines, streams, kernels, copies, synchronization, collectives, power/clocks, occupancy, warp stalls, cache behavior, bandwidth, and instruction throughput.

## Core knowledge
A profiler is an observation instrument, not an oracle. Timeline analysis identifies where time goes; kernel counters explain why. Measurement overhead, sampling, asynchronous execution, warm-up, dynamic clocks, and concurrent tenants can distort conclusions.

## Procedure
1. Define the user-visible metric and regression boundary.
2. Reproduce under controlled conditions.
3. Capture a low-overhead end-to-end timeline.
4. Attribute idle gaps to CPU, dependencies, transfers, collectives, or scheduling.
5. Rank kernels by contribution, not curiosity.
6. Deep-profile the dominant kernels.
7. Compare achieved compute/bandwidth with architecture limits.
8. Inspect stalls and resource limiters.
9. Form a single causal hypothesis.
10. Validate with a controlled code/configuration change.
11. Repeat measurements and quantify variance.
12. Document the causal chain.

## Decision points
Deep-profile only kernels material to end-to-end cost. Use microbenchmarks to isolate mechanisms, but validate every conclusion in the full workload.

## Common failure patterns
Profiling debug builds, interpreting asynchronous API duration incorrectly, comparing different input shapes, ignoring clock throttling, optimizing kernels outside the critical path, and treating correlation as causation.

## Verification
Require repeated before/after measurements, stable correctness, counter changes consistent with the hypothesis, and improvement in the target end-to-end metric.

## Expected output
A ranked performance decomposition, root-cause hypothesis with evidence, and verified remediation.

## Stop conditions
Stop when the workload cannot be reproduced, profiling changes behavior materially, hardware health is suspect, or measurements are too noisy to distinguish the proposed effect.