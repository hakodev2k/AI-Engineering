# Search API Contracts

## Purpose
Keep search interfaces predictable, bounded, compatible, and explicit about semantics.

## Scope
Search endpoints, request/response models, errors, filters, sorting, pagination, and versioning.

## MUST
- Validate request data before executing search logic.
- Define semantics and limits for query text, filters, sort, pagination, timeouts, and result fields.
- Return stable machine-readable error categories for caller-actionable failures.
- Treat breaking changes to public search behavior or schema as versioned contract changes.

## MUST NOT
- expose backend-specific query DSLs to untrusted callers unless intentionally sandboxed and bounded.
- silently reinterpret existing request fields in a breaking way.
- return internal exception details or credentials.

## SHOULD
- Keep backend implementation details out of public contracts.
- Provide request identifiers for supportable diagnostics.

## Exceptions
Breaking production contracts require explicit human approval, migration strategy, communication, and rollback/compatibility plan.

## Verification
Use schema/contract tests, backward-compatibility tests, validation tests, security review, and consumer evidence.