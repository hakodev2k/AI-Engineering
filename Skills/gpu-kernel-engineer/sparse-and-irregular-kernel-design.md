# Sparse and Irregular Kernel Design

## Purpose
Design efficient GPU kernels for sparse, graph, ragged, and data-dependent workloads that do not map cleanly to dense regular tiling.

## When to use
Use for sparse matrices, graph traversal, ragged tensors, adaptive meshes, irregular gathers/scatters, and highly skewed workloads.

## Inputs
Data structure, sparsity pattern, degree/row-length distribution, memory layout, target GPU, profiler traces, and correctness contract.

## Context to inspect
Load imbalance, indirect memory access, index width, locality, atomic contention, work-queue design, preprocessing cost, and workload skew.

## Core knowledge
Irregular kernels are often limited by memory latency, poor coalescing, branch divergence, and imbalance rather than arithmetic throughput. Representation and work scheduling can matter more than low-level instruction tuning.

## Procedure
1. Characterize sparsity and workload distributions rather than using only averages.
2. Identify the unit of work and quantify imbalance across threads, warps, and blocks.
3. Evaluate alternative representations for locality and metadata overhead.
4. Group or bucket work by size when this reduces divergence materially.
5. Use warp-cooperative processing for large irregular items where appropriate.
6. Privatize or aggregate updates before atomics when contention is high.
7. Consider prefix sums, compaction, or persistent work queues for dynamic scheduling.
8. Measure preprocessing cost together with kernel runtime.
9. Test adversarial skew, empty segments, and extreme-degree items.
10. Compare end-to-end performance against simpler representations and trusted libraries.

## Decision points
Prefer preprocessing when structures are reused enough to amortize it. Use dynamic scheduling when static assignment leaves substantial hardware idle; retain simpler mapping when queue overhead dominates.

## Common failure patterns
Optimizing for average row/degree only; excessive metadata; uncoalesced index chasing; global atomic hot spots; preprocessing that costs more than it saves; and ignoring pathological skew.

## Verification
Validate outputs against a reference across multiple sparsity patterns and confirm improvements in lane utilization, memory behavior, and total pipeline time.

## Expected output
A representation and scheduling strategy with workload-distribution evidence and performance measurements.

## Stop conditions
Stop when real sparsity distributions are unavailable or preprocessing changes ordering/semantics that the consumer requires.