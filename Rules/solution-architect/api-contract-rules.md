# API Contract Rules

## Purpose
Protect consumers from accidental breaking changes and ambiguous API behavior.

## Scope
Applies to public and internal HTTP/gRPC APIs and long-lived service contracts.

## MUST
- API contracts MUST define request, response, validation, errors, authorization, and compatibility expectations.
- Breaking changes MUST use a migration/versioning strategy and explicit consumer impact review.
- Pagination, filtering, sorting, and idempotency semantics MUST be explicit where relevant.
- Error contracts MUST be stable enough for consumers to handle deterministically.
- Sensitive fields MUST be excluded unless required and authorized.

## MUST NOT
- MUST NOT leak storage schema or implementation internals as accidental contract guarantees.
- MUST NOT silently reinterpret existing fields in incompatible ways.
- MUST NOT rely on client behavior not represented in the documented contract.

## SHOULD
- Prefer additive compatible evolution when practical.
- Use contract tests for high-value consumer/provider relationships.

## Exceptions
Experimental APIs may relax stability when clearly labeled, isolated, and not relied upon for critical workflows.

## Verification
Review OpenAPI/protobuf schemas, contract diffs, consumer tests, authorization tests, backward-compatibility checks, and deprecation plans.