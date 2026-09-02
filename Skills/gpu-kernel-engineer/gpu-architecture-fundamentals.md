# GPU Architecture Fundamentals

## Purpose
Provide a repeatable method for reasoning about GPU execution hardware so kernel decisions are grounded in measurable architectural constraints rather than CPU intuition.

## When to use
Use when designing, reviewing, porting, or optimizing kernels; when performance differs sharply across GPU generations; or when occupancy, latency, or memory throughput is unclear.

## Inputs
Target GPU model, kernel source, compiler flags, launch configuration, profiler traces, and workload shapes.

## Context to inspect
Execution model, compute units/SMs, warp or wavefront width, scheduler behavior, register file limits, shared-memory capacity, cache hierarchy, memory channels, supported instruction sets, and relevant compiler target.

## Core knowledge
GPU throughput depends on massive parallelism, latency hiding, SIMT/SIMD execution, memory hierarchy, and resource residency. Peak FLOPS or bandwidth alone does not predict real kernel performance. Senior work requires understanding which hardware resource is limiting the workload and how architectural limits interact.

## Procedure
1. Identify the target GPU architecture and supported execution features.
2. Map kernel threads to warps/wavefronts and compute units.
3. Estimate registers, shared memory, and blocks resident per compute unit.
4. Identify dominant instruction classes and memory spaces.
5. Compare theoretical issue, compute, and bandwidth ceilings with observed metrics.
6. Check whether latency is hidden by sufficient active work.
7. Identify architecture-specific hazards such as bank conflicts, divergent control flow, or weak cache locality.
8. Re-evaluate assumptions on every target architecture rather than extrapolating blindly.
9. Record constraints that affect later optimization decisions.

## Decision points
Optimize for the actual target fleet. Prefer portable structure when multiple vendors or generations matter; use architecture-specific tuning only when its benefit justifies maintenance cost.

## Common failure patterns
Applying CPU cache intuition directly; assuming higher occupancy is always better; optimizing for peak specifications; ignoring instruction mix; and hard-coding generation-specific launch parameters without fallback logic.

## Verification
Confirm architecture information from the runtime or vendor tooling, compare profiler counters to calculated limits, and reproduce measurements across representative workloads.

## Expected output
An architecture-aware performance model, identified bottleneck candidates, and explicit constraints for kernel design.

## Stop conditions
Stop when the target hardware is unknown, profiler counters are unavailable for a critical claim, or optimization would depend on undocumented behavior.