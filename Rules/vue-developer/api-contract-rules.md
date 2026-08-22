# API Contract Rules

## Purpose
Protect the frontend from accidental assumptions about backend contracts and compatibility.

## Scope
Request/response models, HTTP semantics, validation errors, pagination, versioning, and generated clients.

## MUST
- API assumptions MUST be represented in types, schemas, adapters, or tests rather than scattered implicit property access.
- Required and optional fields MUST match the actual contract, including nullable behavior.
- Breaking backend contract changes MUST be coordinated with a compatibility or deployment strategy.
- Error responses used for user decisions MUST be mapped by stable machine-readable semantics, not brittle message text.
- Pagination, sorting, filtering, and date/time semantics MUST be explicit.

## MUST NOT
- UI logic MUST NOT depend on undocumented response fields or accidental ordering.
- Human-readable backend error messages MUST NOT be parsed as stable program logic.
- A public contract change MUST NOT be shipped as compatible without verification against affected consumers.

## SHOULD
- Prefer schema-generated or centrally defined client types where reliable source contracts exist.
- Isolate backend-specific shapes behind feature adapters when domain/UI models differ materially.

## Exceptions
Rapid prototypes may use provisional contracts only when clearly marked, bounded, and removed before production reliance.

## Verification
Run contract tests, type checks, integration tests, and inspect API schemas/diffs for changed fields and semantics.