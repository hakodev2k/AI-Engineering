# Roofline and Throughput Modeling

## Purpose
Determine whether a GPU kernel is fundamentally limited by memory traffic, arithmetic throughput, or another execution resource, and use that model to prioritize optimization work.

## When to use
Use when deciding whether to reduce bytes, increase arithmetic intensity, change precision, fuse operations, or pursue instruction-level optimization.

## Inputs
Kernel FLOP or operation count, bytes transferred at relevant memory levels, measured runtime, achieved bandwidth/throughput, target GPU specifications, representative tensor/problem shapes.

## Preconditions
The workload and operation-count convention must be defined consistently. Measurements must represent a warmed, correct kernel.

## Context to inspect
Inspect DRAM and cache traffic, data reuse, precision, tensor/matrix instruction eligibility, launch occupancy, instruction mix, and whether theoretical peak figures are realistic for the workload.

## Core knowledge
Arithmetic intensity is useful only when bytes are counted at the bottleneck memory level. Peak compute and bandwidth are ceilings, not guarantees. A roofline model narrows the search space but must be reconciled with latency, dependencies, occupancy, cache behavior, and specialized execution units.

## Procedure
1. Define useful work and count operations consistently.
2. Estimate compulsory and actual bytes moved.
3. Calculate arithmetic intensity.
4. Plot or compare achieved performance against relevant compute and bandwidth ceilings.
5. Determine the nearest limiting roof.
6. Cross-check with profiler counters.
7. If memory-bound, investigate reuse, layout, fusion, compression, or precision.
8. If compute-bound, inspect instruction mix, matrix-unit use, dependencies, and precision.
9. If far below both roofs, investigate latency, divergence, synchronization, or launch inefficiency.
10. Recompute the model after each material design change.

## Decision points
Increase arithmetic intensity only if added computation or storage does not cost more than the traffic saved. Use reduced precision when numerical requirements permit. Treat cache-resident workloads with cache-level roofs rather than DRAM alone.

## Common failure patterns
Using requested bytes instead of actual traffic; mixing FLOP counting conventions; claiming compute-bound from high utilization alone; comparing against unsupported peak modes; ignoring shape-dependent reuse.

## Verification
Confirm model predictions align with measured counters and that an optimization aimed at the identified roof changes runtime in the expected direction.

## Expected output
A documented performance model identifying the dominant resource ceiling and the highest-value optimization direction.

## Stop conditions
Escalate when operation or traffic counts cannot be established reliably, vendor counters contradict the model without explanation, or performance is dominated by system-level effects outside the kernel.