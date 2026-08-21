# Skill: API and Integration Automation

## Purpose
Verify service contracts, authorization, state transitions, error semantics, idempotency, and integration behavior below the UI layer.

## Trigger
Use for REST/HTTP APIs, service boundaries, background-trigger endpoints, webhooks, or integration contracts.

## Inputs
API contract, auth model, request/response examples, data lifecycle, environment endpoint, dependency behavior, acceptance criteria.

## Procedure
1. Inspect OpenAPI/contracts and existing API-test conventions.
2. Define happy path plus invalid input, authn/authz, boundary, not-found/conflict, concurrency/idempotency, pagination/filtering, and dependency-failure scenarios where relevant.
3. Provision unique test data through approved APIs/fixtures.
4. Make requests using the project-standard client.
5. Assert status, headers where contractual, semantic body fields, persistence/side effects, and absence of unintended effects.
6. Avoid exact full-payload assertions for volatile fields unless the full schema is the contract.
7. Validate cleanup and repeated execution.
8. Run focused and relevant suites; retain machine-readable evidence.

## Decisions
- Contract checks belong at API/integration layer unless only the UI can observe the requirement.
- Use schema validation as a baseline, not as a substitute for semantic assertions.
- Retry only operations documented as safe/idempotent.
- When eventual consistency exists, poll boundedly for the business state with explicit timeout.

## Quality criteria
Tests are isolated, environment-safe, authorization-aware, deterministic, and diagnose contract vs dependency failures.

## Stop conditions
Do not invoke irreversible endpoints against production, rotate secrets, or alter access policies without explicit approval.
