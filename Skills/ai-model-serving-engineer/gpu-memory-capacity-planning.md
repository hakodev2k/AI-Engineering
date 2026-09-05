# GPU Memory and Capacity Planning

## Purpose
Plan accelerator memory and replica capacity so model serving remains stable under realistic concurrency and context sizes.

## When to use
Use before deployment, during capacity reviews, or when OOMs, queueing, or unexpected concurrency limits appear.

## Inputs
Model weights, precision, runtime, KV-cache behavior, context lengths, batch sizes, concurrency targets, GPU types, and growth forecasts.

## Preconditions
Use actual runtime measurements when available; theoretical memory calculations are only a starting point.

## Context to inspect
Weight memory, runtime overhead, CUDA graphs, allocator behavior, KV cache, activation buffers, fragmentation, tensor/pipeline parallelism, and system-reserved memory.

## Core knowledge
Serving capacity is often constrained by memory before raw FLOPS. KV-cache consumption scales with sequence length, batch/concurrency, architecture, and precision. Fragmentation and runtime overhead reduce usable capacity.

## Procedure
1. Measure static model memory after load.
2. Measure incremental memory per active sequence across context sizes.
3. Include runtime, graph, communication, and fragmentation headroom.
4. Determine safe concurrency at target context distributions.
5. Model peak and burst workloads, not only averages.
6. Calculate replica count under N+1 failure assumptions.
7. Validate with sustained load and worst-case prompts.
8. Define memory saturation alerts and admission thresholds.

## Decision points
Choose larger accelerators when memory density materially reduces parallelism complexity; choose model sharding only when single-device deployment is impossible or cost-inefficient.

## Common failure patterns
Using parameter count as total memory, ignoring KV cache, running to near-100% memory, and sizing only for median context length.

## Verification
Run load tests at expected and worst-case sequence distributions and confirm no OOM, allocator thrashing, or unstable tail latency.

## Expected output
A documented memory budget, safe concurrency range, replica requirement, and headroom policy.

## Stop conditions
Stop and redesign when the workload cannot fit safely on available hardware with acceptable headroom.