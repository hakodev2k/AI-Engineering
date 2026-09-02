# Shared Memory Tiling

## Purpose
Use on-chip shared/local memory to increase data reuse, reduce global-memory traffic, and restructure accesses for efficient parallel execution.

## When to use
Use for matrix, stencil, reduction, transpose, convolution, histogram, or neighborhood kernels where multiple threads reuse nearby data.

## Inputs
Kernel source, tileable dimensions, data layout, shared-memory limits, bank geometry, and profiler results.

## Context to inspect
Reuse pattern, tile halo requirements, synchronization points, bank conflicts, per-block memory footprint, occupancy impact, and global-memory transactions.

## Core knowledge
Shared memory is software-managed and fast but finite. Tiling wins only when reuse or access transformation repays staging and synchronization cost. Tile size changes occupancy, bank behavior, and boundary complexity.

## Procedure
1. Quantify repeated global loads that a tile could reuse.
2. Define a tile mapped cleanly to the thread block/workgroup.
3. Include halo or padding requirements explicitly.
4. Stage data cooperatively with coalesced global loads.
5. Synchronize only where producer-consumer ordering requires it.
6. Check bank mapping and add padding or remapping when conflicts are material.
7. Estimate shared-memory footprint and resulting residency.
8. Benchmark multiple tile sizes on representative shapes.
9. Verify boundaries and partial tiles separately.
10. Compare end-to-end traffic and runtime against the untiled baseline.

## Decision points
Use shared memory when reuse is substantial or access reshaping is necessary. Prefer cache-only execution for low-reuse data when staging overhead dominates.

## Common failure patterns
Oversized tiles reducing residency; unnecessary barriers; bank conflicts; redundant staging; incorrect halo handling; and assuming shared memory is always faster than cache.

## Verification
Confirm correctness, reduced global traffic, acceptable occupancy, absence of harmful bank conflicts, and statistically meaningful speedup.

## Expected output
A tile design, resource model, synchronization plan, and benchmark evidence.

## Stop conditions
Stop when required shared memory exceeds supported limits, synchronization semantics are unclear, or numerical behavior changes unexpectedly.