# Testing and Simulation

## Purpose
Build a layered test strategy for automation workflows so behavior is verified under normal, boundary, dependency-failure, retry, replay, and concurrency conditions.

## When to use
Use before releasing new workflows or materially changing triggers, contracts, side effects, AI steps, or recovery behavior.

## Inputs
Workflow definition, contracts, test fixtures, dependency sandboxes, acceptance criteria, failure modes, and production incident history.

## Context to inspect
Inspect existing unit/integration tests, connector mocks, staging limitations, seed data, destructive operations, environment differences, and flaky tests.

## Core knowledge
Workflow testing should isolate pure transformations, validate contracts at boundaries, and exercise real integrations where safe. Mocks prove local assumptions, not vendor behavior. Failure-path testing is as important as happy-path testing.

## Procedure
1. Derive scenarios from business outcomes and failure modes.
2. Unit-test deterministic transformations and decision functions.
3. Add schema/contract tests for external boundaries.
4. Use realistic fixtures for nulls, duplicates, large payloads, and malformed data.
5. Integration-test authentication, pagination, throttling, and side-effect semantics in safe environments.
6. Simulate timeouts, dependency outages, and partial success.
7. Test retry, replay, deduplication, and compensation.
8. Test concurrency and ordering where relevant.
9. Evaluate AI steps against a versioned dataset and explicit metrics.
10. Verify observability and audit events as part of tests.
11. Run end-to-end acceptance scenarios before release.
12. Add regression tests for every material incident.

## Decision points
Mock dependencies for fast deterministic local tests; use sandbox/contract tests for integration truth. Avoid destructive production testing unless explicitly governed and isolated.

## Common failure patterns
Happy-path-only tests, asserting node execution rather than business outcome, unrealistic mocks, production credentials in tests, and nondeterministic AI tests without tolerances or evaluation metrics.

## Verification
A release candidate must pass required test layers with evidence that failure handling and side effects were verified, not merely implemented.

## Expected output
A repeatable test suite and test plan covering deterministic logic, contracts, integrations, failure paths, AI evaluation, and end-to-end outcomes.

## Stop conditions
Stop when a required high-impact integration cannot be tested safely or acceptance criteria are too ambiguous to determine pass/fail.