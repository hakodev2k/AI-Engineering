# Type System Rules

## Purpose
Make type checking sound, predictable, and diagnosable.

## Scope
Type inference, checking, conversions, generics, constraints, and overload resolution.

## MUST
- Type judgments MUST follow documented rules with deterministic resolution.
- Implicit conversions MUST be bounded and tested for ambiguity and information loss.
- Generic constraints MUST be enforced before target lowering relies on them.
- Type-system fixes MUST include minimal reproductions and regression tests.

## MUST NOT
- MUST NOT weaken soundness merely to accept a problematic program.
- MUST NOT make overload resolution depend on nondeterministic iteration order.
- MUST NOT erase safety-relevant type information before all consumers have validated it.

## SHOULD
- Complex inference SHOULD expose diagnostics that identify the failed constraint.
- Internal type representations SHOULD have canonical forms where equivalence matters.

## Exceptions
Compatibility exceptions require explicit scope, evidence, migration impact, and approval.

## Verification
Use conformance tests, property tests, differential compilation, ambiguity suites, and invariant assertions.