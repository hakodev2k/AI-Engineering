# KV Cache Lowering

## Purpose
Lower and optimize key-value cache operations for autoregressive LLM inference, including allocation, indexing, growth, paging, and reuse.

## When to use
Use when implementing decode support, paged attention, prefix caching, long-context inference, or diagnosing cache-related memory and correctness issues.

## Inputs
- Model attention semantics
- Cache tensor/layout format
- Batch and sequence behavior
- Runtime allocation model
- Backend attention capabilities

## Preconditions
Define token positions, cache ownership, maximum context, batch mutation rules, and whether requests are continuous-batched or static.

## Context to inspect
Inspect cache read/write operations, block tables, page size, sequence metadata, beam/search behavior, request lifecycle, prefix sharing, device placement, and attention lowering.

## Core knowledge
KV cache is persistent mutable state. Compiler transformations must preserve token ordering, request isolation, head grouping, and position semantics. Paged layouts reduce fragmentation and support dynamic batching but add indirection. Cache layout should align with attention kernels and memory bandwidth constraints.

## Procedure
1. Define logical cache semantics independently of physical layout.
2. Trace cache reads/writes for prefill and decode.
3. Validate position and sequence-length updates.
4. Choose contiguous or paged layout based on workload behavior.
5. Encode block/page mapping and bounds checks.
6. Align cache layout with fused attention requirements.
7. Handle request completion, reuse, prefix sharing, and eviction safely.
8. Account for multi-query/grouped-query head layouts.
9. Test interleaved requests and boundary context lengths.
10. Measure memory utilization, fragmentation, decode latency, and bandwidth.

## Decision points
Prefer contiguous cache for simple stable batches and short contexts. Prefer paging for continuous batching, variable contexts, and high utilization. Enable prefix sharing only with explicit ownership and invalidation rules.

## Common failure patterns
- Off-by-one token positions.
- Cross-request cache aliasing.
- Incorrect block-table updates after batching changes.
- Cache layout incompatible with attention kernels.
- Measuring allocated cache without fragmentation or reserved capacity.

## Verification
Implemented means cache-backed decoding runs. Verified means multi-step generation matches a no-cache reference, concurrent requests remain isolated, boundary lengths are safe, and memory/latency metrics meet workload targets.

## Expected output
A correct cache lowering and layout policy with lifecycle rules, tests, and memory/performance evidence.

## Stop conditions
Stop when request lifecycle or position semantics are undefined, cache ownership cannot be proven, or maximum-memory requirements exceed deployment limits.