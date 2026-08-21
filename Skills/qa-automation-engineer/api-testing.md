# API Testing

## Purpose
Validate service contracts, business behavior, security boundaries, and failure handling directly at the API layer.

## When to use
Use for REST/GraphQL/RPC services, backend regression, integration validation, and fast business-rule coverage.

## Inputs
API specification, authentication scheme, domain rules, data model, dependency behavior.

## Context to inspect
Routes/operations, schemas, status/error conventions, authorization, idempotency, pagination, rate limits, timeouts, versioning, and side effects.

## Core knowledge
Test contract plus semantics: transport success alone is insufficient. Validate schema, business outcome, persistence/side effects, authorization, error model, retries, duplicate requests, and compatibility.

## Procedure
1. Identify consumer-critical operations and invariants.
2. Establish deterministic authenticated/unauthenticated clients.
3. Test valid requests and meaningful boundaries.
4. Validate status, headers, schema, body, and side effects.
5. Exercise malformed, unauthorized, forbidden, conflicting, duplicate, and missing-resource cases.
6. Test pagination/filtering/sorting semantics where applicable.
7. Verify idempotency and concurrency-sensitive operations.
8. Simulate dependency failures and timeout behavior when controllable.
9. Keep contract assertions compatible with intentional extensibility.
10. Integrate fast API suites into CI.

## Decision points
Use real dependencies for integration confidence; use stubs for deterministic fault injection. Avoid asserting every optional field when consumers do not depend on it.

## Common failure patterns
Only 200-path tests, weak body assertions, ignoring authorization, hard-coded shared data, confusing schema validation with business validation, no side-effect checks.

## Verification
Run against representative environment, compare contract and observed behavior, inspect persistence/events where relevant, and confirm negative cases fail correctly.

## Expected output
Fast, deterministic API regression coverage tied to consumer and business risks.

## Stop conditions
Escalate when the API contract or expected authorization semantics are undefined.