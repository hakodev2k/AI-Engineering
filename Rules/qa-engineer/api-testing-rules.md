# API Testing Rules
## Purpose
Verify service contracts, behavior, resilience, and compatibility independently of UI behavior.
## Scope
HTTP APIs, RPC interfaces, webhooks, and service integrations.
## MUST
- Verify contract shape, status semantics, validation, authorization, idempotency, pagination, error behavior, and compatibility when applicable.
- Test malformed, missing, duplicate, unauthorized, and boundary inputs for exposed operations.
- Verify side effects and persisted state, not only response codes.
## MUST NOT
- Assume UI coverage proves API correctness or security.
- Treat undocumented breaking contract changes as acceptable because current consumers still pass.
## SHOULD
- Use contract/schema validation and consumer-relevant compatibility checks in CI.
## Exceptions
Unavailable external systems may be simulated if assumptions and separate integration evidence are documented.
## Verification
Inspect API test reports, schemas, captured requests/responses, state assertions, and compatibility checks.