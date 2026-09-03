# Layout Transformation and Propagation

## Purpose
Choose, propagate, and transform tensor layouts so generated LLM kernels use memory efficiently while minimizing unnecessary transposes and copies.

## When to use
Use when backend kernels prefer specific layouts, transpose traffic is high, quantized formats require packing, or model import produces layout mismatches.

## Inputs
- Tensor IR and shape metadata
- Backend kernel layout requirements
- Profiling traces
- Existing layout constraints
- Quantization/packing rules

## Preconditions
Know which operations are layout-sensitive and which can operate on logical views without physical movement.

## Context to inspect
Inspect strides, contiguous assumptions, transpose/view semantics, matmul operands, attention layouts, packed weights, vector widths, and generated copies.

## Core knowledge
A layout is a physical data organization, not merely a logical axis order. Good layout propagation keeps producers and consumers compatible, favors coalesced access, respects vectorization and tensor-core constraints, and avoids materializing transposes unless their benefit exceeds cost.

## Procedure
1. Inventory layout constraints for major operators.
2. Track logical shape separately from physical strides/layout.
3. Identify costly layout-conversion boundaries.
4. Propagate preferred layouts backward and forward through compatible ops.
5. Evaluate alternative layouts for matmul, attention, normalization, and quantized weights.
6. Materialize transformations only when required.
7. Preserve alias/view correctness.
8. Inspect generated memory accesses.
9. Benchmark conversion cost and downstream kernel gain.
10. Add fallback layouts for unsupported shapes or hardware.

## Decision points
Prefer views when stride semantics suffice. Materialize copies when they unlock substantially faster downstream kernels and amortize their cost. Preserve packed layouts across multiple consumers when practical.

## Common failure patterns
- Treating transpose as free.
- Losing stride information during lowering.
- Forcing one layout globally.
- Breaking alias assumptions with hidden copies.
- Ignoring alignment requirements of packed formats.

## Verification
Implemented means layout metadata propagates and codegen accepts it. Verified means outputs match, copy count is understood, memory access is valid, and representative end-to-end latency improves or remains within the intended trade-off.

## Expected output
Layout rules, conversion points, backend constraints, and measured performance evidence.

## Stop conditions
Stop when physical-layout semantics are undocumented, a required backend format cannot represent necessary shapes, or layout conversion introduces correctness ambiguity.