# Attention Kernel Optimization

## Purpose
Improve transformer attention latency and memory efficiency by selecting and tuning optimized attention kernels appropriate to the model and hardware.

## When to use
Use when profiling shows attention is a significant inference bottleneck, especially for long contexts or prefill-heavy workloads.

## Inputs
Model architecture, sequence-length distribution, head dimensions, precision, accelerator generation, runtime, and benchmark baseline.

## Context to inspect
Inspect supported fused or memory-efficient attention kernels, causal/masked attention requirements, grouped-query or multi-query attention, tensor layouts, compiler settings, and fallback operators.

## Core knowledge
Attention cost changes between prefill and decode. Kernel efficiency depends on dimensions, precision, memory layout, and hardware. Fused implementations can reduce intermediate memory traffic, but unsupported shapes may silently fall back to slower paths.

## Procedure
1. Profile attention time separately for prefill and decode.
2. Confirm model attention semantics and tensor shapes.
3. Inventory kernels supported by the runtime and target accelerator.
4. Enable the best supported fused or memory-efficient implementation.
5. Verify no silent fallback occurs for representative shapes.
6. Benchmark short, medium, and long contexts.
7. Measure memory allocation and bandwidth in addition to latency.
8. Test numerical stability and output equivalence within tolerance.
9. Evaluate interactions with quantization, tensor parallelism, and compilation.
10. Lock versions and document required kernel constraints.

## Decision points
Prefer fused kernels when they preserve semantics and improve measured end-to-end performance. Keep a safe fallback for unsupported shapes or hardware. Optimize decode and prefill separately when their bottlenecks differ.

## Common failure patterns
Assuming kernel availability means kernel usage, benchmarking only one context length, ignoring layout-conversion overhead, numerical instability at low precision, and optimizing kernel time without end-to-end impact.

## Verification
Use profiler traces to confirm optimized kernels execute. Compare end-to-end latency, memory, and model outputs with the reference configuration.

## Expected output
A validated attention-kernel configuration and compatibility note for supported model shapes and hardware.

## Stop conditions
Stop when optimized kernels alter required semantics, introduce numerical instability, or runtime fallback behavior cannot be controlled.