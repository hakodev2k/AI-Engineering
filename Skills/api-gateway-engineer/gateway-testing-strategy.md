# Gateway Testing Strategy

## Purpose
Build regression protection for routing, security, resilience, protocol behavior, and configuration changes.

## When to use
Use when introducing gateway CI, adding policies, changing routes, or investigating repeated regressions.

## Inputs
Gateway configuration, API contracts, security policies, backend test doubles, production failure history.

## Context to inspect
Current unit/config validation, integration environments, load tests, negative tests, deployment gates, rollback coverage.

## Core knowledge
Gateway tests should cover configuration validity, route selection, identity policy, malformed traffic, upstream failures, protocol behavior, and performance. A successful config load is not behavioral verification.

## Procedure
1. Validate configuration schema and references statically.
2. Build route-table tests including ambiguity and negative matches.
3. Test authentication and authorization boundaries.
4. Exercise malformed, oversized, and adversarial requests.
5. Inject upstream timeouts, resets, and unhealthy endpoints.
6. Verify retries and idempotency rules.
7. Run protocol-specific integration tests.
8. Load-test critical traffic paths.
9. Test deployment, drain, and rollback behavior.
10. Promote only when required evidence is green.

## Decision points
Use test doubles for deterministic failure cases; include real representative backends for integration confidence. Keep a small high-value smoke suite for every rollout and deeper suites in CI.

## Common failure patterns
Only happy-path tests, assertions on status code alone, no negative auth tests, non-production gateway configuration in tests, flaky timing assumptions.

## Verification
Tests fail when known policy defects are intentionally introduced and pass against the intended effective configuration.

## Expected output
A layered gateway test suite tied to release gates and production risks.

## Stop conditions
Escalate when critical behavior cannot be exercised outside production.