# Skill: API Feature Implementation

## Purpose
Deliver a production-ready ASP.NET Core API feature from an approved requirement while preserving existing contracts, architecture boundaries, security, observability, and maintainability.

## Trigger
Use when a task requests a new endpoint, a change to an existing endpoint, or a backend capability exposed through HTTP.

## Inputs
- Business objective and acceptance criteria
- Repository access
- Existing API contracts and related tests
- Data model and integration constraints
- Security requirements
- Deadline and rollout constraints

## Preconditions
- Critical ambiguity has been identified.
- Breaking changes are explicitly approved.
- Required downstream dependencies are known or isolated behind interfaces.

## Required context
1. Locate the endpoint, handler/service, domain/application logic, persistence code, validation, tests, and observability patterns nearby.
2. Inspect existing conventions before introducing a new abstraction.
3. Record facts, assumptions, and open questions separately.

## Tools
Repository search, build/test commands, API client, database tooling when required, static analysis, logs/traces for behavior verification.

## Procedure
1. Restate the requested behavior as input/output examples and acceptance criteria.
2. Identify impacted public contracts and persistence boundaries.
3. Trace a similar feature end-to-end.
4. Decide the smallest safe design consistent with current architecture.
5. Define validation, authorization, error behavior, idempotency needs, and observability.
6. Implement the vertical slice from transport to persistence/integration.
7. Add or update unit and integration tests around behavior, edge cases, and failures.
8. Run build, tests, formatting/static analysis, and focused API verification.
9. Inspect the final diff for unrelated changes, secret leakage, accidental contract changes, and missing cancellation handling.
10. Produce a handoff with changed files, evidence, risks, and follow-up items.

## Decision rules
- Prefer existing project conventions over introducing a new pattern for one endpoint.
- Use asynchronous APIs for I/O; propagate `CancellationToken` through request-scoped operations.
- Use `AsNoTracking()` for read-only EF Core queries unless tracking is required.
- Prefer server-side filtering/projection over loading data into memory.
- Treat retries and idempotency as one design problem for externally repeatable operations.
- Reject user input by validation; never rely on client-side validation.

## Constraints
- Do not silently change public response shape, status semantics, auth policy, or database schema.
- Do not add infrastructure unless the requirement justifies its operational cost.
- Do not perform production deployment.

## Expected outputs
- Production-ready code
- Tests
- Updated contract/documentation where relevant
- Verification evidence
- Risk and assumption record

## Quality criteria
- Acceptance criteria are traceable to implementation and tests.
- Error handling is deterministic and consistent.
- Authorization is explicit for protected operations.
- Logs contain useful identifiers without secrets or sensitive payloads.
- Database access is bounded and query shape is understood.

## Verification
Required evidence normally includes successful build, relevant automated tests, API behavior checks, and final diff inspection.

## Failure handling
- Missing requirement: stop implementation of the ambiguous portion and escalate with concrete options.
- Build/test failure caused by the change: fix before delivery.
- External dependency unavailable: verify via contract test/mocked boundary and report incomplete live verification.

## Stop conditions
Stop and request approval before breaking API contracts, destructive schema changes, production actions, secret changes, or irreversible migrations.
