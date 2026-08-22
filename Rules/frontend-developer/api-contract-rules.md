# API Contract Rules
## Purpose
Keep frontend integrations compatible with authoritative service contracts.
## Scope
Request/response schemas, generated clients, versioning, nullability, errors, and feature compatibility.
## MUST
- Frontend assumptions about fields, enums, errors, and optionality MUST match an authoritative contract or validated runtime behavior.
- Unknown or newly introduced server values MUST fail safely where forward compatibility is required.
- Breaking contract changes MUST identify rollout ordering and compatibility window before release.
- Client-side types MUST NOT create stronger guarantees than the server contract without validation.
## MUST NOT
- Public/service contracts MUST NOT be changed solely from frontend code without coordination and approval by the contract owner.
- Missing fields MUST NOT silently become plausible fabricated values when meaning matters.
## SHOULD
- Prefer generated or schema-validated clients when they reduce contract drift.
## Exceptions
Temporary compatibility adapters require explicit removal criteria.
## Verification
Contract tests, schema diff, integration tests, generated-client diff, and staged compatibility testing.