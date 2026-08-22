# API Automation Rules

## Purpose
Ensure API tests validate contracts and behavior at the correct protocol boundary.

## Scope
Applies to HTTP/RPC APIs, authentication, validation, errors, pagination, idempotency, and integrations.

## MUST
- Tests MUST assert externally meaningful status, headers, schema, and business outcomes appropriate to the contract.
- Negative cases MUST cover authorization, validation, malformed input, and relevant boundary conditions.
- Idempotent or retry-sensitive operations MUST be tested for duplicate delivery where applicable.
- API tests MUST control or identify their data and authentication context.

## MUST NOT
- MUST NOT assert private implementation details instead of public contract behavior.
- MUST NOT accept any 2xx response when the contract requires a specific outcome.
- MUST NOT expose tokens or secrets in test reports.

## SHOULD
- Prefer contract-level assertions reusable across scenarios.
- Include compatibility tests for versioned or widely consumed APIs.

## Exceptions
Implementation-specific assertions are allowed only for explicit component/integration tests and must be labeled accordingly.

## Verification
Review request/response evidence, contract specifications, negative coverage, duplicate-delivery cases, and secret-redacted logs.