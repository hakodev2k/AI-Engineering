# Graph Pattern Rewriting

## Purpose
Recognize and transform multi-operator graph patterns into equivalent forms that improve execution efficiency, backend compatibility, or fusion potential.

## When to use
Use when implementing attention rewrites, replacing subgraphs with fused primitives, normalizing exporter-specific patterns, or eliminating redundant computation.

## Inputs
- IR graph examples
- Operator semantics
- Pattern-matching infrastructure
- Backend capabilities
- Numerical requirements

## Preconditions
Have a semantic oracle or trusted reference execution for the source pattern. Understand side effects, aliases, layouts, and shape conditions.

## Context to inspect
Inspect producer-consumer relationships, use counts, control flow, constants, dtype conversions, shape guards, device placement, and existing rewrite ordering.

## Core knowledge
Graph rewrites are correct only under explicit preconditions. Matching syntax alone is insufficient: use counts, aliasing, shape relations, numerical modes, and effects can change legality. Rewrites should be profitable, deterministic, and observable in compiler dumps.

## Procedure
1. Capture canonical positive and negative examples.
2. Define the semantic pattern and legal preconditions.
3. Add constraints for shape, dtype, device, aliasing, and use count.
4. Choose the replacement graph or intrinsic.
5. Preserve metadata needed downstream.
6. Define rewrite priority relative to competing patterns.
7. Add profitability checks when benefits depend on size or hardware.
8. Test near-miss patterns that must not rewrite.
9. Compare numerical outputs to the reference.
10. Measure graph size, launches, memory traffic, and latency before and after.

## Decision points
Use unconditional canonical rewrites only for clearly beneficial equivalences. Use target-aware profitability heuristics for hardware-sensitive transformations. Prefer a high-level intrinsic when downstream code generation can exploit semantic structure.

## Common failure patterns
- Matching a visual graph pattern while missing semantic conditions.
- Rewriting nodes with external users.
- Ignoring aliasing or side effects.
- Creating target-specific regressions on small shapes.
- Competing passes repeatedly undoing one another.

## Verification
Implemented means the intended graphs rewrite. Verified means negative cases remain unchanged, reference results match within tolerance, IR verifies, and representative benchmarks show expected improvement or coverage gain.

## Expected output
A guarded rewrite with positive/negative tests, profitability logic, and benchmark evidence.

## Stop conditions
Stop when equivalence depends on undocumented operator behavior, alias/effect safety cannot be established, or benchmark evidence contradicts the assumed profitability.