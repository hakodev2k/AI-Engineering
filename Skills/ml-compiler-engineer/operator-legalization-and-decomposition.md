# Operator Legalization and Decomposition

## Purpose
Convert high-level ML operators into a smaller set of well-defined primitives while preserving semantics and creating optimization opportunities.

## When to use
Use when adding unsupported operators, simplifying backend support, resolving lowering failures, or separating frontend semantics from backend capabilities.

## Inputs
Operator specification, source and target IRs, dtype/shape rules, numerical tolerances, backend support matrix, reference implementation.

## Context to inspect
Inspect broadcasting, promotion, rounding, NaN/Inf behavior, layout constraints, quantization semantics, side effects, shape inference, and existing canonical decompositions.

## Core knowledge
Legalization is about semantic equivalence under explicit constraints, not merely producing executable code. Decompositions should avoid introducing hidden complexity, pathological expansion, or numerically unstable formulations.

## Procedure
1. Write the source operator’s exact semantic contract.
2. Identify target primitive operations and their constraints.
3. Check dtype, broadcasting, shape, and edge-case equivalence.
4. Determine whether decomposition preserves numerical behavior within accepted tolerance.
5. Guard unsupported cases with legality checks rather than silent miscompilation.
6. Implement rewrite patterns with deterministic matching.
7. Preserve source locations and diagnostics where possible.
8. Add positive, negative, and boundary-case tests.
9. Compare generated IR complexity and downstream optimization opportunities.
10. Benchmark decomposition when it materially affects performance.

## Decision points
Prefer decomposition for stable semantic expansions shared by backends. Prefer target-native lowering when hardware has a specialized operation or decomposition materially degrades performance or precision.

## Common failure patterns
Incorrect broadcasting, dtype promotion differences, excessive graph expansion, unstable math identities, missing edge cases, and legalizations that depend on accidental pass ordering.

## Verification
Differential-test against a trusted reference across dtypes and shapes, run target backend tests, inspect legality after the pass, and benchmark representative workloads.

## Expected output
A semantics-preserving legalization/decomposition with tests, constraints, performance evidence where relevant, and clear unsupported-case diagnostics.

## Stop conditions
Stop if operator semantics are underspecified, target primitives cannot preserve required behavior, or accepted numerical tolerance is undefined for a potentially lossy decomposition.