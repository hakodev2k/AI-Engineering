# Memory Footprint Optimization

## Purpose
Reduce peak and steady-state memory to fit larger models, longer contexts, higher concurrency, or cheaper hardware.

## When to use
For OOM failures, low concurrency, excessive allocator pressure, or memory-driven cost.

## Inputs
Memory profiles, model graph, tensor lifetimes, runtime, hardware limits, workload shapes.

## Preconditions
Reproduce memory behavior with representative peak workloads.

## Context to inspect
Inspect weights, activations, KV cache, temporary workspaces, allocator fragmentation, host memory, transfers, duplicate model copies, and runtime caches.

## Core knowledge
Peak memory depends on tensor lifetime and concurrency, not model size alone. Fragmentation and workspace algorithms can dominate. Reducing memory may increase compute or latency.

## Procedure
1. Measure memory by major category.
2. Locate peak allocation points.
3. Remove unintended copies and retained tensors.
4. Evaluate lower precision for safe components.
5. Tune workspace/allocator behavior.
6. Apply paging/offload only when transfer cost is acceptable.
7. Optimize KV/cache policy for sequence workloads.
8. Stress maximum supported shapes and concurrency.
9. Measure latency/throughput trade-offs.
10. Define safe memory headroom.

## Decision points
Prefer eliminating copies before offloading. Trade recomputation for memory only when latency/compute budgets allow it.

## Common failure patterns
Measuring idle memory only, ignoring fragmentation, tuning average rather than peak shapes, offloading across a slow interconnect, and leaving no headroom.

## Verification
Peak workload runs without OOM, memory reduction is measured, and performance/quality remain within gates.

## Expected output
Memory budget, profile evidence, applied optimizations, capacity limits, and operational headroom.

## Stop conditions
Stop if required workload bounds are unknown or proposed changes create unacceptable latency/reliability risk.