# GPU Kernel Profiling

## Purpose
Use accelerator profiling to identify kernel, memory, synchronization, and launch inefficiencies in LLM inference.

## When to use
Use after higher-level bottleneck analysis shows execution rather than queueing or network is limiting performance.

## Inputs
Reproducible workload, model/runtime build, GPU model, profiler access, and baseline metrics.

## Context to inspect
Kernel timeline, occupancy, memory throughput, launch gaps, graph capture, synchronization, collectives, and CPU scheduling.

## Core knowledge
A busy GPU is not necessarily efficient. Decode can be memory-bandwidth limited; prefill can be compute limited. Kernel fusion, graph capture, and optimized attention matter only when they address measured costs.

## Procedure
1. Freeze model, runtime, drivers, workload, and clocks/power settings where practical.
2. Capture a short representative profile after warm-up.
3. Attribute wall time to kernels, collectives, copies, synchronization, and idle gaps.
4. Compare achieved compute/memory throughput with hardware ceilings.
5. Inspect small-kernel launch overhead and CPU gaps.
6. Validate attention and GEMM kernels match expected optimized paths.
7. Change one runtime/kernel option at a time.
8. Measure end-to-end impact, not profiler counters alone.
9. Record profiler overhead and sampling limitations.

## Decision points
Prefer runtime configuration fixes before custom kernels. Custom optimization is justified only for stable, material hotspots with sufficient volume.

## Common failure patterns
Profiling cold start, enormous traces, mistaking occupancy for throughput, optimizing negligible kernels, and ignoring CPU launch bottlenecks.

## Verification
Confirm profiler findings with end-to-end benchmark improvement and repeatability.

## Expected output
Ranked hotspots, causal evidence, tested remediation, and residual bottlenecks.

## Stop conditions
Stop if profiling materially changes behavior or production access would violate safety policy; reproduce in a controlled environment.