# Type and Boundary Validation Rules
## Purpose
Use static types without confusing compile-time assumptions with runtime truth.
## Scope
TypeScript or equivalent type systems, external data, assertions, narrowing, and unsafe escapes.
## MUST
- Data crossing untrusted runtime boundaries MUST be validated when malformed values can cause material failure.
- Nullability and optionality MUST model the authoritative contract rather than optimistic assumptions.
- Unsafe casts or type escapes MUST be localized and justified by an invariant or validation boundary.
- Discriminated states SHOULD represent mutually exclusive UI states when they prevent impossible combinations.
## MUST NOT
- Type assertions MUST NOT be used to hide known contract mismatches.
- `any`-like escape hatches MUST NOT spread across public application boundaries without deliberate review.
## SHOULD
- Make illegal or contradictory states difficult to represent where complexity remains reasonable.
## Exceptions
Untyped legacy integrations may use adapters with validation and migration boundaries.
## Verification
Strict type checking, lint rules, runtime validation tests, contract tests, and review of unsafe escapes.