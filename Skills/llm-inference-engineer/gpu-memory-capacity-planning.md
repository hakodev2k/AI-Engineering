# GPU Memory and Capacity Planning

## Purpose
Size accelerator fleets from model memory, KV cache, workload distributions, and service objectives.

## When to use
Use before procurement, deployment sizing, context-window changes, quantization changes, or unexplained OOM events.

## Inputs
Model configuration, precision, runtime overhead, GPU type, prompt/output distributions, concurrency, SLOs, and growth forecast.

## Context to inspect
Weights, allocator behavior, KV-cache format, CUDA graphs, temporary buffers, fragmentation, tensor-parallel layout, and observed utilization.

## Core knowledge
Capacity is constrained by both memory and compute. Weight size alone is insufficient: KV cache grows with active sequence tokens and runtime workspaces consume headroom. Peak sustainable throughput must preserve latency objectives.

## Procedure
1. Calculate weight memory for the deployed representation.
2. Measure non-weight runtime overhead after warm-up.
3. Calculate KV bytes per token using the actual architecture/runtime.
4. Convert traffic distributions into concurrent active-token demand.
5. Reserve explicit safety margin for fragmentation, kernels, and variance.
6. Benchmark prefill-heavy and decode-heavy cases separately.
7. Determine replicas required for steady load, bursts, failures, and maintenance.
8. Compare scale-up and scale-out cost/performance.
9. Record assumptions and create alerts tied to saturation signals.

## Decision points
Increase GPUs when memory-bound; use faster GPUs or optimized kernels when compute-bound. Reduce precision or context only when quality/product constraints allow. Do not rely on high average utilization if tail latency collapses near saturation.

## Common failure patterns
Using theoretical FLOPS as capacity, ignoring KV cache, sizing from averages, no failure reserve, and assuming allocator memory equals useful cache capacity.

## Verification
Reproduce projected concurrency and token distributions in load tests; verify OOM-free operation and target tail latency with a replica unavailable.

## Expected output
A documented capacity model, replica count, safety margin, bottleneck classification, and scaling thresholds.

## Stop conditions
Stop when workload distributions or model/runtime memory characteristics cannot be measured reliably.