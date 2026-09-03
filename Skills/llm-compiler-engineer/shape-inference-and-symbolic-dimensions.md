# Shape Inference and Symbolic Dimensions

## Purpose
Model, infer, and validate tensor shapes across static, partially dynamic, and symbolic LLM workloads so optimization and code generation remain correct.

## When to use
Use when adding dynamic batch/sequence support, implementing a new operator, diagnosing shape-related compile failures, or enabling specialization.

## Inputs
- IR graph
- Operator shape semantics
- Input shape constraints
- Runtime shape ranges
- Backend restrictions

## Preconditions
Separate unknown values from symbolic-but-constrained values. Identify whether dimensions can change per request or only between compiled variants.

## Context to inspect
Inspect shape inference, constraint propagation, broadcasting, reshape/view semantics, attention dimensions, KV-cache growth, guards, specialization cache, and backend launch requirements.

## Core knowledge
LLM dimensions such as batch, sequence length, heads, head dimension, vocabulary, and cache length have different variability. Symbolic reasoning should propagate equalities, products, ranges, divisibility, and broadcast constraints. Specialization can unlock optimizations but increases compile latency and code-cache footprint.

## Procedure
1. Identify all dynamic and symbolic input dimensions.
2. Express operator-specific shape constraints explicitly.
3. Propagate equalities, ranges, divisibility, and broadcast rules.
4. Detect contradictions as early as possible.
5. Preserve symbols through reshape, transpose, slicing, and attention transformations.
6. Introduce guards only where backend code depends on a condition.
7. Decide which dimensions warrant specialization.
8. Define fallback behavior for unseen shapes.
9. Test minimum, maximum, boundary, and incompatible shapes.
10. Measure specialization hit rate and code-cache growth.

## Decision points
Keep dimensions symbolic when workload variability is high. Specialize stable dimensions when measured performance gain justifies compile and cache cost. Prefer bounded dynamic kernels when backend support is efficient enough.

## Common failure patterns
- Treating unknown and symbolic dimensions as identical.
- Losing equality constraints through reshape.
- Generating excessive specialized variants.
- Missing integer overflow in size calculations.
- Accepting incompatible broadcasts until runtime.

## Verification
Implemented means shape inference completes. Verified means valid dynamic inputs execute correctly, invalid shapes fail predictably, guards cover backend assumptions, and specialization behavior is measured on representative traffic.

## Expected output
Correct symbolic shape propagation, explicit guards, tests, and a documented specialization policy.

## Stop conditions
Stop when operator shape semantics are undefined, runtime shape ranges are unknown for memory-critical paths, or backend constraints cannot safely represent required dynamic behavior.