# Roofline Performance Analysis

## Purpose
Use the roofline model to determine whether GPU work is fundamentally constrained by arithmetic throughput, memory bandwidth, or insufficient efficiency relative to either ceiling.

## When to use
Use when prioritizing kernel optimizations, comparing algorithms, or explaining why additional FLOPs reduction or memory tuning will or will not help. Do not treat theoretical peak specifications as directly achievable application targets.

## Inputs
- Operation count or estimated FLOPs
- Bytes transferred at relevant memory levels
- Measured kernel runtime
- Hardware compute and bandwidth characteristics
- Profiler counters when available

## Context to inspect
Inspect precision, tensor-core eligibility, cache reuse, memory hierarchy, fusion, input shape, sparsity, and whether operation/byte estimates reflect actual executed work.

## Core knowledge
Arithmetic intensity equals useful operations divided by bytes moved. Low-intensity workloads tend toward bandwidth limits; high-intensity workloads tend toward compute limits. Hierarchical rooflines may reveal L1/L2/DRAM limits that a single bandwidth roof hides.

## Procedure
1. Define the exact kernel or region being modeled.
2. Estimate executed operations and memory traffic.
3. Validate estimates against profiler counters when possible.
4. Compute arithmetic intensity.
5. Plot or compare achieved performance against relevant roofs.
6. Determine whether the gap is caused by compute utilization, bandwidth efficiency, or insufficient intensity.
7. Identify changes that move the workload rightward, upward, or reduce total work.
8. Test fusion, tiling, reuse, precision, or algorithm changes based on the diagnosis.
9. Recalculate the model after optimization.

## Decision points
Increase data reuse when bandwidth-bound and reuse is available. Use specialized math units when compute-bound and numerics permit. Reduce total operations when neither hardware ceiling is the main issue. Prefer end-to-end simplification over micro-optimization when the modeled kernel is not material.

## Common failure patterns
- Using source-level FLOPs instead of executed operations
- Ignoring cache-level bandwidth ceilings
- Assuming peak hardware numbers are sustained ceilings
- Counting bytes incorrectly after caching or fusion
- Optimizing arithmetic intensity while increasing latency elsewhere

## Verification
Confirm model predictions agree directionally with profiler evidence and that the proposed optimization improves measured runtime, not merely the modeled metric.

## Expected output
A roofline-based bottleneck classification, assumptions, measured position relative to ceilings, and evidence-backed optimization priorities.

## Stop conditions
Stop when operation or traffic estimates are too uncertain to support decisions, or when profiler evidence contradicts the model and requires deeper investigation.