# KV Cache Engineering

## Purpose
Manage KV-cache capacity, reuse, eviction, and fragmentation to improve LLM serving throughput and stability.

## When to use
Use for long-context workloads, prefix reuse, memory pressure, cache thrashing, or unexplained concurrency limits.

## Inputs
Model dimensions, precision, context/output distributions, concurrency, cache implementation, GPU memory telemetry.

## Context to inspect
Allocator, block/page sizing, prefix-cache policy, eviction, cache hit metrics, memory fragmentation, model weights, and non-KV allocations.

## Core knowledge
KV memory grows with active sequence length and model architecture. Paged allocation reduces fragmentation; prefix caching can save prefill compute but consumes memory and introduces tenancy/privacy considerations. Cache efficiency must be evaluated against admission capacity.

## Procedure
1. Calculate theoretical KV bytes per token. 2. Reconcile theory with runtime measurements. 3. Reserve headroom for weights, kernels, graphs, and temporary buffers. 4. Analyze active-context distribution and fragmentation. 5. Tune block sizing and eviction. 6. Evaluate prefix reuse by actual hit rate and saved prefill work. 7. Partition or scope reusable cache across security boundaries. 8. Stress-test long contexts, cancellations, and churn. 9. Alert on cache saturation and eviction storms.

## Decision points
Enable prefix caching only when reuse is meaningful and isolation rules permit it. Prefer smaller pages for fragmentation-sensitive mixed lengths; larger pages may reduce metadata/management overhead.

## Common failure patterns
Treating free GPU memory as KV capacity, ignoring temporary allocations, cross-tenant cache leakage, no eviction telemetry, and sizing from average context length.

## Verification
Validate measured memory/token, maximum safe concurrency, hit rate, fragmentation, latency, and OOM behavior under worst representative load.

## Expected output
A safe KV-cache capacity model, policy, telemetry, and operating limits.

## Stop conditions
Stop if model architecture is unknown, tenant isolation requirements are unresolved, or measurements contradict the capacity model.