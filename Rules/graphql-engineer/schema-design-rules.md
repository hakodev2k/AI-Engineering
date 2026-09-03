# Schema Design Rules

## Purpose
Define durable GraphQL schemas that communicate domain intent and remain safe to evolve.

## Scope
Applies to public and internal GraphQL schemas, including object, interface, union, enum, scalar, input, query, mutation, and subscription definitions.

## MUST
- Model domain concepts explicitly instead of mirroring storage tables or transport DTOs mechanically.
- Define field nullability intentionally based on domain guarantees and failure semantics.
- Keep schema names, descriptions, and type relationships consistent enough for clients to discover behavior without implementation knowledge.
- Review schema changes for client compatibility before merge.
- Treat schema shape as a long-lived contract and document material trade-offs for significant redesigns.

## MUST NOT
- Expose database-specific implementation details as the API contract unless they are intentionally part of the domain model.
- Add fields whose semantics are ambiguous, unstable, or overloaded.
- Use nullability as a convenience to avoid defining correct error or lifecycle behavior.
- Introduce redundant types or aliases that create multiple competing representations of the same concept without a migration plan.

## SHOULD
- Prefer cohesive types with clear ownership boundaries.
- Prefer composable field design over deeply nested one-off payload structures.
- Use custom scalars only when standard scalar semantics are insufficient and serialization rules are clearly defined.

## Exceptions
Exceptions require documented rationale, compatibility impact, alternatives considered, and reviewer approval when the change affects external consumers.

## Verification
Verify through schema diff review, contract tests, generated documentation inspection, client compatibility checks, and architecture review for cross-domain changes.