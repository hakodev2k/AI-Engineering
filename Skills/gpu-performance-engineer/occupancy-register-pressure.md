# Occupancy and Register Pressure

## Purpose
Balance occupancy, register use, shared memory, and instruction efficiency instead of treating maximum occupancy as a universal optimization target.

## When to use
Use when kernels show latency-hiding problems, low active warps, register spills, resource-limited launches, or performance changes after compiler/kernel refactoring.

## Inputs
- Kernel launch configuration
- Registers per thread and shared memory per block
- Occupancy and stall metrics
- Generated code or compiler resource reports
- Baseline timing

## Context to inspect
Inspect block size, register allocation, spills, shared memory, active blocks per SM, instruction-level parallelism, memory latency, and architecture limits.

## Core knowledge
Occupancy is a means of hiding latency, not an end. Lower occupancy can outperform higher occupancy if it enables better register reuse, instruction-level parallelism, or fewer spills. Resource trade-offs must be evaluated empirically.

## Procedure
1. Measure current occupancy and kernel timing.
2. Identify the resource limiting active blocks or warps.
3. Check whether observed stalls indicate insufficient latency hiding.
4. Inspect compiler reports for register allocation and spills.
5. Sweep sensible block sizes.
6. Test register-limiting compiler options only as controlled experiments.
7. Refactor long live ranges or temporary storage if spills are material.
8. Reassess shared-memory allocation if it constrains residency.
9. Compare timing, stalls, spills, and occupancy together.
10. Retain the configuration that minimizes workload time, not the one with the highest occupancy.

## Decision points
Accept lower occupancy when it reduces spills or enables more useful per-thread state. Reduce registers when latency hiding is actually constrained and extra instructions/spills do not offset the gain. Change block size when launch geometry, not algorithmic structure, is the primary limiter.

## Common failure patterns
- Targeting 100% occupancy blindly
- Forcing register counts and causing spills
- Ignoring architecture-specific limits
- Benchmarking only one input size
- Confusing theoretical occupancy with achieved execution efficiency

## Verification
Verify stable speedup, reduced relevant stalls or spills, and no end-to-end regression across supported GPUs and workload shapes.

## Expected output
A documented resource-balance decision with measured occupancy, register/shared-memory usage, kernel timing, and rationale.

## Stop conditions
Stop if resource changes make performance unstable across required inputs or if gains are within run-to-run noise.