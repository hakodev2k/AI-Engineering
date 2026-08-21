# Agent Testing

## Purpose
Test agent systems across deterministic code, model behavior, tools, integrations, and complete workflows.

## When to use
Use during implementation and before changes to prompts, tools, models, memory, or orchestration.

## Inputs
Agent code, tool contracts, test cases, fixtures, dependency simulators, evaluation thresholds.

## Context to inspect
Unit boundaries, external APIs, nondeterministic components, retries, state stores, and production failure history.

## Core knowledge
Traditional tests and probabilistic evaluations complement each other. Deterministic components should have deterministic tests; model-dependent behavior needs distributions, rubrics, and tolerances.

## Procedure
1. Unit-test parsers, validators, policies, and state transitions.
2. Contract-test every tool boundary.
3. Simulate timeouts, malformed responses, and partial failures.
4. Test representative model-driven trajectories.
5. Verify retry and idempotency behavior.
6. Exercise memory and concurrency cases.
7. Add adversarial safety tests.
8. Run end-to-end tasks in isolated environments.
9. Track flaky cases separately from true regressions.
10. Promote production incidents into regression tests.

## Decision points
Mock expensive dependencies for deterministic logic; use real integrations for contract confidence; use recorded fixtures when live systems are unstable.

## Common failure patterns
Mocking everything, asserting exact model prose, no failure injection, shared mutable fixtures, and treating stochastic variance as ordinary flakiness.

## Verification
Confirm deterministic suites are stable and behavioral evaluations meet statistically meaningful thresholds.

## Expected output
Layered automated tests plus behavioral evaluations covering critical paths.

## Stop conditions
Stop release when critical paths lack testability or failures cannot be reproduced.