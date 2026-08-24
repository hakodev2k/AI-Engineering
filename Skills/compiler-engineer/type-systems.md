# Type Systems

## Purpose
Design and implement sound, predictable type checking and inference for production language features.

## When to use
Use for new types, generics, inference, conversions, variance, overloads, or type-checker failures.

## Inputs
Type-system specification, constraints, AST/bound tree, failing programs, compatibility and performance budgets.

## Context to inspect
Type representation, canonicalization, subtype/conversion relations, constraint solver, inference phases, error types, generic instantiation.

## Core knowledge
Type checking is a constraint problem whose soundness, completeness, decidability, diagnostics, and performance trade off. Error recovery must not silently weaken safety.

## Procedure
1. Formalize the typing rule and invariants.
2. Identify representation and relation changes.
3. Define inference variables and constraints.
4. Specify conversion/subtyping interactions.
5. Define behavior for ambiguity and failure.
6. Bound solver complexity and recursion.
7. Implement error recovery without treating invalid types as valid.
8. Add positive, negative, generic, recursive, ambiguous, and stress tests.

## Decision points
Prefer explicit annotations when inference would be unstable or expensive. Use canonical types when identity matters; structural comparison when language semantics require it.

## Common failure patterns
Exponential constraint solving, unsound implicit conversions, order-dependent inference, infinite recursive types, misleading secondary errors, inconsistent nullability.

## Verification
Run conformance and negative suites, solver stress tests, compile-time benchmarks, and compatibility tests.

## Expected output
A type-system change with clear rules, bounded complexity, diagnostics, and regression evidence.

## Stop conditions
Stop if requested behavior violates established soundness/compatibility guarantees without an approved language-design decision.