# Release Automation Testing

## Purpose
Test release tooling and pipelines as production software so automation failures do not become deployment incidents.

## When to use
Use when developing pipeline templates, deployment scripts, release controllers, migration automation, or shared delivery tooling.

## Inputs
Pipeline definitions, scripts, infrastructure APIs, test environments, fixtures, failure scenarios, and expected state transitions.

## Preconditions
Release automation can run against isolated or disposable targets without affecting production.

## Context to inspect
Inspect shell/scripts, reusable workflows, API calls, retries, timeouts, concurrency, credential handling, state files, and cleanup logic.

## Core knowledge
Release automation has logic, state, external dependencies, and failure modes just like applications. Test pure transformations cheaply, integrations against controlled systems, and end-to-end behavior on disposable environments. Idempotency and interruption recovery deserve explicit tests.

## Procedure
1. Decompose automation into testable units and external effects.
2. Add static validation and syntax/schema checks.
3. Unit-test transformations, version logic, and policy decisions.
4. Integration-test registry/cloud/orchestrator interactions with safe targets.
5. Test duplicate invocation and partial completion.
6. Test timeout, unavailable dependency, and permission failures.
7. Test concurrency and stale-state behavior.
8. Run end-to-end deploy and recovery in disposable environments.
9. Verify cleanup and evidence generation.
10. Gate changes to shared release tooling on these tests.

## Decision points
Mock external systems for deterministic edge cases but retain real integration tests for API semantics. Use ephemeral environments when stateful deployment behavior cannot be represented reliably by mocks.

## Common failure patterns
Testing only happy paths, scripts validated manually in production, mocks that hide authentication/API behavior, no concurrency tests, and cleanup failures leaving resources that affect later runs.

## Verification
Demonstrate tests fail for intentionally broken deployment logic and pass after correction; verify interruption and retry do not corrupt target state.

## Expected output
A layered test suite for release automation with meaningful failure and recovery coverage.

## Stop conditions
Stop rollout of shared automation when critical paths cannot be tested safely, destructive commands lack isolation guards, or failure recovery is undefined.