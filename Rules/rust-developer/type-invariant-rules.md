# Type Invariants

## Purpose
Use Rust's type system to make invalid states difficult or impossible to represent.

## Scope
Domain types, state machines, identifiers, validated values, typestates, and generic constraints.

## MUST
- Domain values with nontrivial validity constraints MUST validate before becoming trusted domain types.
- State transitions MUST preserve documented invariants.
- Newtypes MUST be considered where primitive confusion could cause correctness or security failures.
- Generic bounds MUST express actual behavioral requirements rather than accidental implementation constraints.

## MUST NOT
- MUST NOT expose unchecked construction paths that bypass safety-critical invariants.
- MUST NOT represent mutually exclusive states with independent flags when contradictory combinations are possible.

## SHOULD
- Prefer enums for closed state sets and exhaustive matching for meaningful state transitions.
- Keep type-level complexity proportional to the risk it prevents.

## Exceptions
Runtime validation may replace type encoding when state space or interoperability makes type-level modeling impractical; rationale must be recorded.

## Verification
Review constructors and transition functions, add property/unit tests, and require exhaustive compiler-checked handling where appropriate.