# Operator Decomposition and Canonicalization

## Purpose
Normalize equivalent graph patterns and decompose unsupported or overly complex operators while preserving opportunities for later optimization.

## When to use
Use when expanding backend coverage, simplifying pass matching, importing new model families, or replacing framework-specific composite operators.

## Inputs
- Source operator semantics
- Existing canonical forms
- Backend operator support
- Fusion patterns
- Numerical tolerances

## Preconditions
Know which high-level operators are still valuable to downstream fusion or partitioning. Do not decompose solely for convenience if it destroys important semantic structure.

## Context to inspect
Inspect rewrite rules, pass ordering, pattern matcher behavior, operator versioning, constant folding, fusion passes, and backend legalization.

## Core knowledge
Canonicalization reduces equivalent graph forms to a smaller set, simplifying analysis. Decomposition trades semantic richness for portability. Rewrites must terminate, avoid oscillation, preserve dtype and broadcasting rules, and remain numerically equivalent within an explicit tolerance.

## Procedure
1. Define the target canonical form.
2. Document exact source semantics and edge cases.
3. Check whether downstream passes need the original operator.
4. Implement rewrite preconditions explicitly.
5. Preserve dtype, shape, layout, effects, and device metadata.
6. Prevent rewrite cycles with ordering or canonical direction.
7. Add constant-folding opportunities only when safe.
8. Compare source and rewritten execution across boundary values.
9. Benchmark whether decomposition harms fusion or memory traffic.
10. Add regression tests for unsupported and versioned variants.

## Decision points
Keep composite operators intact when backend kernels or graph fusions exploit them. Decompose when portability or unsupported-op coverage dominates. Use target-specific legalization late in the pipeline.

## Common failure patterns
- Rewrite loops.
- Semantic drift in padding, masking, reduction, or rounding.
- Breaking quantization boundaries.
- Expanding one efficient op into memory-heavy primitives.
- Applying rewrites before shape constraints are known.

## Verification
Implemented means rewritten IR passes verification. Verified means reference outputs match, no rewrite cycles occur, representative models still fuse as expected, and backend coverage improves without unacceptable regressions.

## Expected output
Deterministic rewrite rules, tests, and pass-ordering guidance.

## Stop conditions
Stop when source semantics are ambiguous, equivalence cannot be established, or decomposition creates a known severe regression without an alternative execution path.