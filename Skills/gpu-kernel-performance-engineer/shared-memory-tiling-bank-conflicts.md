# Shared Memory Tiling and Bank Conflicts

## Purpose
Use on-chip shared/local memory to increase data reuse and reduce expensive global-memory traffic while avoiding bank conflicts, excessive synchronization, and occupancy collapse.

## When to use
Use for stencils, matrix/tensor tiles, reductions, neighborhood operations, reuse-heavy kernels, or when profiling shows repeated global loads that can be shared within a block/workgroup.

## Inputs
Kernel access pattern, tile dimensions, shared-memory capacity, bank organization guidance, profiler shared-memory metrics, synchronization points, representative problem sizes.

## Preconditions
The computation must expose reuse among threads in the same block/workgroup. Correctness for boundary and partial-tile cases must be testable.

## Context to inspect
Inspect reuse distance, halo requirements, tile shape, per-block shared-memory footprint, bank-conflict behavior, alignment, padding, synchronization count, register pressure, and resulting resident blocks.

## Core knowledge
Shared memory trades explicit data movement and synchronization for reuse. A tile that reduces global traffic can still lose if it introduces bank conflicts, barriers, or enough resource pressure to reduce latency hiding. Bank-conflict rules vary by architecture and access width.

## Procedure
1. Quantify how many global loads could be eliminated through cooperative reuse.
2. Define candidate tiles around the logical reuse dimensions.
3. Compute shared-memory footprint including halos and padding.
4. Map cooperative loads so lanes access global memory efficiently.
5. Add only the synchronization required for data visibility and reuse phases.
6. Profile bank conflicts, shared-memory throughput, occupancy, and global-byte reduction.
7. Test padding or layout changes when bank serialization is material.
8. Sweep tile sizes while respecting register and shared-memory constraints.
9. Compare against a simpler no-tiling baseline.
10. Validate edge tiles and divergent boundary paths.

## Decision points
Use shared memory when reuse amortizes staging and barriers. Prefer register shuffles for small warp-local exchanges when they are simpler and cheaper. Add padding only when measured conflicts matter more than the extra capacity.

## Common failure patterns
Tiling data with little reuse; allocating the largest possible tile; adding barriers inside hot loops unnecessarily; fixing bank conflicts by destroying global coalescing; ignoring occupancy impact; mishandling partial tiles.

## Verification
Confirm reduced global traffic, acceptable bank-conflict metrics, improved end-to-end runtime, preserved occupancy or sufficient latency hiding, and correct results for edge shapes.

## Expected output
A measured tiling design with tile geometry, memory footprint, synchronization plan, and before/after profiler evidence.

## Stop conditions
Escalate when shared-memory capacity cannot accommodate useful reuse, synchronization dominates, or architecture-specific bank behavior would violate portability goals.