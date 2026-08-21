# API Contract Rules

## Purpose
Protect API correctness, compatibility, and consumer expectations.

## Scope
Applies to public and internal HTTP APIs and serialized contracts.

## MUST
- Request and response contracts MUST be explicit, validated, and versioned when breaking evolution is required.
- HTTP methods, status codes, headers, and error payloads MUST reflect documented semantics.
- Contract changes MUST be reviewed for backward compatibility and known consumers.
- Pagination, filtering, sorting, and idempotency behavior MUST be deterministic and documented when supported.
- Validation errors MUST be distinguishable from authentication, authorization, conflict, and server failures.

## MUST NOT
- MUST NOT expose persistence entities directly when doing so leaks internal schema or unstable fields.
- MUST NOT silently change field meaning, nullability, units, identifiers, or enum semantics.
- MUST NOT return success for partial or failed operations unless the contract explicitly defines that behavior.

## SHOULD
- Prefer additive compatible evolution over breaking changes.
- Prefer stable machine-readable error contracts.

## Exceptions
Breaking changes require impact analysis, migration/deprecation strategy, rollout plan, and approval.

## Verification
Use OpenAPI/schema diffing, contract tests, consumer tests, integration tests, and review of representative clients.