# Shared Memory and Tiling

## Purpose
Use shared memory and tiling to increase data reuse, reduce global-memory traffic, and improve locality without creating excessive synchronization or resource pressure.

## When to use
Use when repeated global-memory accesses dominate runtime and data reuse is structured enough to stage cooperatively within a block.

## Inputs
- Access pattern and reuse structure
- Tile dimensions and problem shapes
- Shared-memory capacity and bank geometry
- Baseline memory traffic and kernel timing

## Context to inspect
Inspect halo regions, reuse count, alignment, bank mapping, occupancy impact, synchronization frequency, and edge-tile behavior.

## Core knowledge
Tiling exchanges extra instructions, shared-memory capacity, and synchronization for reduced off-chip traffic. The best tile size balances reuse, occupancy, parallelism, and boundary overhead.

## Procedure
1. Quantify reusable global-memory traffic.
2. Define candidate tiles aligned with computation and thread mapping.
3. Estimate shared-memory footprint per block.
4. Design cooperative loads with coalesced global accesses.
5. Add only required synchronization.
6. Check shared-memory bank conflicts.
7. Handle partial tiles without excessive divergence.
8. Sweep tile sizes under realistic shapes.
9. Measure DRAM traffic, occupancy, and kernel runtime.
10. Compare against a non-tiled baseline and simpler cache-based alternatives.

## Decision points
Use shared-memory tiling when reuse is high and predictable. Rely on caches when reuse is modest and staging cost dominates. Use asynchronous copy mechanisms only when target hardware and pipeline structure justify added complexity.

## Common failure patterns
- Oversized tiles that collapse occupancy
- Bank conflicts introduced by layout
- Too many barriers
- Poor coalescing during tile loads
- Optimizing interior tiles while edge handling dominates small inputs

## Verification
Verify lower global-memory traffic, no new correctness issues at boundaries, stable speedup across representative shapes, and acceptable shared-memory/occupancy trade-offs.

## Expected output
A tile design with rationale, resource calculations, before/after traffic and timing, and supported shape constraints.

## Stop conditions
Stop when staging overhead exceeds saved traffic, shared-memory limits make the design non-portable, or required synchronization erases the expected gain.