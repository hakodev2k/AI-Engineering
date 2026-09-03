# Client Contract Documentation Rules

## Purpose
Keep GraphQL behavior discoverable and consumable without requiring clients to inspect server implementation.

## Scope
Applies to schema descriptions, deprecations, examples, operation guidance, error semantics, pagination, and integration documentation.

## MUST
- Public schema elements MUST have descriptions when behavior, units, nullability, side effects, or constraints are not self-evident.
- Deprecated fields and arguments MUST document the preferred replacement and migration expectation.
- Mutation documentation MUST identify material side effects, authorization expectations, and retry or idempotency behavior where relevant.
- Pagination, error, and subscription semantics MUST be documented consistently with implemented behavior.
- Documentation changes MUST accompany contract changes in the same release process.

## MUST NOT
- MUST NOT document behavior that is not covered by implementation evidence or tests.
- MUST NOT leave materially ambiguous field semantics for client teams to infer from examples alone.
- MUST NOT advertise stability guarantees stronger than the actual compatibility policy.

## SHOULD
- SHOULD provide representative operations for complex integration patterns.
- SHOULD generate reference documentation from the authoritative schema where practical.

## Exceptions
Internal-only experimental fields may use lighter documentation if scope, ownership, and instability are explicit.

## Verification
Inspect generated schema docs, descriptions, deprecation guidance, client examples, contract tests, and release diffs for consistency.