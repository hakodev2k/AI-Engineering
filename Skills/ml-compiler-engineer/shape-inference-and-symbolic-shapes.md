# Shape Inference and Symbolic Shapes

## Purpose
Design and debug static and symbolic shape reasoning so compiled ML programs remain correct across dynamic input sizes without unnecessary recompilation.

## When to use
Use when adding dynamic-shape support, fixing shape propagation, reducing specialization explosions, or validating shape-dependent optimizations.

## Inputs
Operator shape semantics, symbolic dimensions, constraints, representative input ranges, guard behavior, backend limitations.

## Context to inspect
Inspect symbolic expression representation, equality/range constraints, broadcast rules, reshape semantics, control-flow joins, guard generation, specialization keys, and runtime shape checks.

## Core knowledge
Shape systems must balance precision, decidability, compilation cost, and backend capability. A symbolic dimension is not merely unknown; it may carry equalities, bounds, divisibility, and relationships used for legality and optimization.

## Procedure
1. Define shape semantics for each relevant operation.
2. Trace symbolic dimensions from inputs through the graph.
3. Record equality, range, divisibility, and broadcast constraints.
4. Detect contradictions and under-constrained transformations.
5. Separate compile-time provable facts from runtime guards.
6. Minimize guards that cause unnecessary recompilation.
7. Ensure transformations preserve symbolic relationships.
8. Test control flow and shape joins where supported.
9. Exercise minimum, typical, maximum, and adversarial shapes.
10. Measure specialization count and compile-cache effectiveness.
11. Verify backend code generation respects dynamic bounds.

## Decision points
Specialize when a target optimization materially benefits and shape cardinality is bounded; remain symbolic when workloads vary broadly. Prefer explicit runtime guards over assuming relationships not proven by the shape system.

## Common failure patterns
Over-specialization, missing guards, incorrect broadcast reasoning, loss of symbolic equality after rewrites, unbounded compile caches, and treating data-dependent dimensions as statically known.

## Verification
Run differential tests over varied shapes, inspect generated guards, confirm expected cache reuse, and validate boundary cases plus invalid-shape diagnostics.

## Expected output
Correct shape propagation, documented symbolic constraints, minimal guard strategy, and evidence that dynamic workloads compile and execute correctly.

## Stop conditions
Stop if required shape relationships cannot be represented safely, runtime bounds are unknown for a target that requires them, or proposed specialization can cause uncontrolled cache growth.