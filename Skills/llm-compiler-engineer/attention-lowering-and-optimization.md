# Attention Lowering and Optimization

## Purpose
Lower transformer attention patterns into efficient implementations while preserving masking, causality, scaling, precision, and dynamic sequence behavior.

## When to use
Use when supporting a new attention variant, enabling fused attention, optimizing long-context models, or fixing attention-specific correctness or performance regressions.

## Inputs
- Attention subgraph or high-level op
- Mask semantics
- Q/K/V shapes and layouts
- Sequence-length distribution
- Target backend capabilities
- Numerical tolerances

## Preconditions
Identify whether attention is self/cross, causal/non-causal, grouped-query, multi-query, paged, sliding-window, or otherwise specialized.

## Context to inspect
Inspect QKV projection boundaries, scale placement, softmax precision, masking, rotary/position transforms, sequence padding, layout, KV cache, and backend fused kernels.

## Core knowledge
Efficient attention reduces intermediate materialization and often fuses score computation, masking, softmax, and value accumulation. Legality depends on exact mask and layout semantics. Long-context behavior is dominated by memory traffic and cache strategy as well as FLOPs.

## Procedure
1. Identify the exact attention semantics from graph and model configuration.
2. Normalize Q/K/V shapes and head grouping without losing layout information.
3. Validate scale, mask, causal, and positional-operation ordering.
4. Match supported fused attention capabilities.
5. Choose tiled or library-backed lowering appropriate to shape and hardware.
6. Keep numerically sensitive reductions in sufficient precision.
7. Integrate KV-cache addressing when decoding.
8. Add fallback lowering for unsupported shapes or masks.
9. Compare against reference attention across edge cases.
10. Benchmark prefill and decode separately across sequence lengths.

## Decision points
Use fused attention when semantics and hardware support match exactly. Fall back to decomposed attention for unusual masks or unsupported shapes. Optimize prefill and decode independently because their bottlenecks differ.

## Common failure patterns
- Incorrect causal-mask offset with cached tokens.
- Wrong grouped-query head mapping.
- Softmax instability in low precision.
- Materializing full attention matrices unnecessarily.
- Benchmarking prefill only while decode dominates production latency.

## Verification
Implemented means attention executes. Verified means reference outputs match within tolerance across masks, lengths, head configurations, and cache states, while profiler evidence shows expected memory and latency behavior.

## Expected output
A guarded attention lowering strategy with correct fallbacks, tests, and prefill/decode benchmark evidence.

## Stop conditions
Stop when mask or positional semantics are ambiguous, cache indexing cannot be established, or fused backend behavior differs from required model semantics.