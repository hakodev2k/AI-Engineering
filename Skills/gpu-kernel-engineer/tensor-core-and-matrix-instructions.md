# Tensor Core and Matrix Instructions

## Purpose
Exploit GPU matrix-multiply acceleration units while preserving layout, precision, and shape correctness.

## When to use
Use for GEMM-like kernels, convolutions lowered to matrix operations, attention blocks, and fused linear algebra where matrix instructions can dominate throughput.

## Inputs
Matrix shapes, layouts, data types, target architecture, alignment constraints, numerical tolerances, and baseline profiler traces.

## Context to inspect
Supported instruction tile sizes, operand layouts, accumulator types, alignment, fragment APIs, shared-memory staging, and occupancy impact.

## Core knowledge
Specialized matrix hardware delivers high throughput only when data is tiled and fed efficiently. Poor layout, insufficient reuse, conversion overhead, or small irregular shapes can erase theoretical gains.

## Procedure
1. Confirm target hardware and supported matrix instruction forms.
2. Map the mathematical operation to supported tile shapes.
3. Define storage, compute, and accumulation precisions.
4. Design global-to-shared and shared-to-register movement for contiguous access.
5. Ensure alignment and layout constraints are satisfied.
6. Pipeline loads and compute when architecture support permits.
7. Handle residual dimensions with safe fallback paths.
8. Compare instruction utilization, memory throughput, and runtime against conventional implementations.
9. Validate numerical error and boundary behavior.

## Decision points
Use specialized matrix paths for sufficiently large, regular workloads; retain conventional vector/scalar paths for unsupported or tiny shapes when setup cost dominates.

## Common failure patterns
Optimizing only compute while starving matrix units; incorrect fragment layouts; excessive format conversion; no remainder path; and assuming peak tensor throughput predicts application speed.

## Verification
Inspect generated matrix instructions, utilization counters, numerical accuracy, and end-to-end speedup across representative shapes.

## Expected output
A documented accelerated matrix path with fallback and measured benefit.

## Stop conditions
Stop when required precision/layout semantics cannot meet the application contract or the target fleet lacks required hardware support.