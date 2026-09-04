# Profiling with Nsight Compute

## Purpose
Diagnose kernel-level GPU inefficiency using hardware counters and source correlation so optimization decisions are based on measured execution behavior.

## When to use
Use after system profiling shows one or more kernels materially dominate runtime, or when a kernel regresses after code, compiler, precision, or hardware changes. Do not start here when the GPU is mostly idle because of host-side orchestration.

## Inputs
- Dominant kernel names and representative launch shapes
- Reproducible workload
- Baseline kernel timing
- Source or generated kernel code when available

## Preconditions
Profile a stable steady-state execution. Limit replay and metric collection scope to avoid excessive perturbation.

## Context to inspect
Inspect launch configuration, occupancy, SM utilization, warp issue efficiency, memory throughput, cache behavior, branch divergence, instruction mix, stalls, and source-level hot spots.

## Core knowledge
A slow kernel may be compute-bound, bandwidth-bound, latency-bound, occupancy-limited, synchronization-heavy, or launch-shape constrained. No single metric proves a bottleneck; counters must be interpreted together with arithmetic intensity and generated code.

## Procedure
1. Isolate the expensive kernel and record baseline latency.
2. Collect a focused metric set before requesting exhaustive counters.
3. Compare achieved compute and bandwidth against realistic hardware ceilings.
4. Inspect warp stall reasons and issue activity.
5. Check memory coalescing, cache hit rates, and transaction efficiency.
6. Check register and shared-memory usage against occupancy.
7. Inspect branch divergence and synchronization frequency.
8. Correlate hot instructions with source or generated assembly.
9. Form one bottleneck hypothesis at a time.
10. Apply the smallest change that tests the hypothesis.
11. Re-measure kernel and end-to-end performance.

## Decision points
Reduce memory traffic when bandwidth is saturated. Improve locality/coalescing when bandwidth is low but memory stalls are high. Reduce registers only when occupancy actually constrains latency hiding. Change algorithm or fusion strategy when instruction or synchronization cost dominates.

## Common failure patterns
- Maximizing occupancy as an end goal
- Collecting all metrics and drowning in noise
- Comparing replayed kernel time directly with end-to-end time
- Ignoring compiler-generated instructions
- Trading correctness or numerical stability for small speedups

## Verification
Verify statistically stable kernel speedup, unchanged outputs within accepted tolerances, and measurable improvement in the parent workload. Re-check counters to confirm the hypothesized bottleneck changed as expected.

## Expected output
A kernel diagnosis with measured limiting factors, supporting counters, proposed intervention, before/after metrics, and residual risks.

## Stop conditions
Stop if profiler replay changes workload behavior materially, the kernel cannot be isolated reproducibly, or optimization requires unsafe numerical assumptions without owner approval.