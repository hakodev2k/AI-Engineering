# API Contract Rules

## Purpose
Prevent frontend/backend contract drift and accidental assumptions about remote APIs.

## Scope
Applies to request/response models, generated clients, error contracts, pagination, versioning, and feature compatibility.

## MUST
- Frontend code MUST treat documented API contracts as authoritative rather than infer undocumented fields or behaviors.
- Required, optional, nullable, and absent values MUST be modeled distinctly when the API distinguishes them.
- Breaking backend contract changes MUST have a coordinated migration strategy before dependent frontend code is released.
- Error handling MUST distinguish transport failure, authentication/authorization failure, validation failure, and domain failure when the API exposes those categories.
- Pagination, sorting, filtering, and version parameters MUST preserve the server contract exactly.

## MUST NOT
- MUST NOT depend on undocumented response fields or ordering.
- MUST NOT silently coerce invalid server payloads into apparently valid UI state.
- MUST NOT expose backend implementation details directly to users without an intentional presentation layer.

## SHOULD
- Prefer generated or schema-validated clients when they materially reduce drift.
- Prefer contract tests for critical integration surfaces.

## Exceptions
Document the temporary compatibility assumption, evidence, expiration condition, and owner.

## Verification
Use schema/type generation checks, integration tests, contract tests, network inspection, and review against API documentation.