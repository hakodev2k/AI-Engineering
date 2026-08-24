# Swift Language Rules

## Purpose
Ensure production Swift is type-safe, explicit about ownership and failure, and maintainable under change.

## Scope
Swift source used by iOS applications, frameworks, extensions, and shared modules.

## MUST
- Public and module-facing APIs MUST express nullability, errors, and concurrency semantics explicitly.
- Value semantics MUST be preferred where identity and shared mutation are not required.
- Resource lifetimes and escaping closures MUST be reviewed for ownership and retain-cycle risk.
- Error paths MUST preserve actionable context without exposing sensitive data.
- Unsafe operations, force casts, and force unwraps MUST have a proven invariant visible at the use site or enforced by tests.

## MUST NOT
- MUST NOT use force unwraps or force casts as routine control flow.
- MUST NOT suppress compiler concurrency or availability warnings merely to make a build pass.
- MUST NOT introduce shared mutable global state without documented synchronization and ownership.

## SHOULD
- APIs SHOULD make invalid states difficult to represent through types.
- Extensions and protocols SHOULD clarify responsibility rather than create hidden coupling.
- Language features SHOULD be selected for readability and predictable runtime behavior, not novelty.

## Exceptions
Any exception must document the invariant, alternatives considered, failure impact, and verification evidence; safety-critical exceptions require reviewer approval.

## Verification
Use compiler warnings as errors where practical, static analysis, focused tests for failure paths, memory diagnostics, and code review of ownership, casts, optionals, and public API changes.