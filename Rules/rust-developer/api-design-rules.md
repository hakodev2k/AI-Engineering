# API Design

## Purpose
Create stable, unsurprising Rust APIs that encode invariants and remain evolvable.

## Scope
Public crates, modules, traits, structs, enums, builders, and service-facing library interfaces.

## MUST
- Public APIs MUST encode required invariants in types where practical.
- Semver-significant changes MUST be identified before release.
- Public behavior, error semantics, ownership, thread-safety, and panic conditions MUST be documented when non-obvious.
- Constructors MUST prevent invalid states or return explicit validation failures.

## MUST NOT
- MUST NOT expose implementation details that unnecessarily constrain future evolution.
- MUST NOT introduce breaking public changes without approved compatibility strategy.
- MUST NOT use ambiguous boolean-heavy APIs where typed options materially improve correctness.

## SHOULD
- Prefer narrow interfaces, exhaustive validation at boundaries, and conventional Rust traits.
- Use `#[non_exhaustive]` where external extensibility is expected and appropriate.

## Exceptions
Compatibility breaks require impact analysis, migration guidance, versioning decision, and approval.

## Verification
Use API review, rustdoc checks, semver tooling where available, downstream compilation tests, and migration tests.