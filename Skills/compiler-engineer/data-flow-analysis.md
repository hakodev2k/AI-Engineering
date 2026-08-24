# Data Flow Analysis

## Purpose
Implement reliable forward/backward data-flow analyses that provide optimization facts without compromising correctness.

## When to use
Use for liveness, reaching definitions, definite assignment, available expressions, nullability, or custom compiler facts.

## Inputs
CFG, transfer functions, lattice/domain definition, desired fact, precision and compile-time requirements.

## Context to inspect
Worklist framework, block ordering, joins, loops, exceptional edges, invalidation, cached analysis results.

## Core knowledge
A data-flow analysis needs a domain, partial order, join/meet, transfer function, boundary condition, and convergence strategy. Monotonicity and finite-height/widening determine termination.

## Procedure
1. State the semantic fact and safety direction.
2. Define domain and top/bottom meaning.
3. Choose forward or backward flow.
4. Define transfer and merge functions.
5. Include all relevant CFG edges.
6. Implement deterministic worklist convergence.
7. Bound memory and pathological iterations.
8. Validate against hand-derived examples.
9. Add loops, joins, exceptions, and unreachable cases.

## Decision points
Choose may-analysis for conservative possibility and must-analysis for guaranteed facts. Trade precision for compile time only when the safety property remains conservative.

## Common failure patterns
Wrong lattice polarity, non-monotone transfer, missing exceptional edges, stale cached results, unsound optimistic initialization, nontermination.

## Verification
Cross-check small cases manually, run verifier/assertions, differential-test optimized output, and benchmark analysis cost.

## Expected output
A documented, terminating, conservative analysis with consumers and invalidation rules defined.

## Stop conditions
Stop when the required fact cannot be computed conservatively with available IR semantics.