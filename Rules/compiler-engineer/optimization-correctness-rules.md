# Optimization Correctness Rules

## Purpose
Ensure optimization never outranks semantic correctness.

## Scope
Canonicalization, scalar, loop, interprocedural, vector, and target-aware optimizations.

## MUST
- Every optimization MUST state its legality preconditions.
- Transformations MUST preserve observable behavior under the language and target memory models.
- Optimization bugs MUST receive regression tests at the smallest reproducible optimization level.
- Profitability decisions MUST be separable from legality decisions.

## MUST NOT
- MUST NOT apply a transform when required alias, range, dominance, overflow, or side-effect facts are unknown.
- MUST NOT claim a speedup without representative before/after measurement.
- MUST NOT delete operations with observable side effects.

## SHOULD
- Optimizations SHOULD degrade conservatively when analysis is inconclusive.
- Complex transforms SHOULD include differential or translation-validation testing.

## Exceptions
Semantics-relaxing modes require explicit user opt-in and documented consequences.

## Verification
Use differential testing across optimization levels, IR verification, randomized programs, benchmarks, and semantic regression suites.