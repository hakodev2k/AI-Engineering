# Data Platform Testing Strategy

## Purpose
Design layered tests that verify platform code, data semantics, integrations, infrastructure, compatibility, and recovery without making delivery prohibitively slow.

## When to use
Use for new platform capabilities, recurring regressions, CI/CD redesign, or critical migration programs.

## Inputs
Architecture, contracts, failure modes, deployment model, representative datasets, SLOs, and incident history.

## Context to inspect
Existing unit/integration tests, test environments, fixtures, mocks, contract checks, load tests, and production escapes.

## Core knowledge
Data platforms need tests for both software behavior and data invariants. Mocks cannot prove cloud/service compatibility. Production-scale issues require representative data shape, skew, concurrency, and failure injection.

## Procedure
1. Rank failure modes by impact and likelihood.
2. Put deterministic logic under fast unit/property tests.
3. Add contract tests at producer-consumer boundaries.
4. Use ephemeral or isolated integration environments for real service behavior.
5. Test schema/table-format and runtime upgrades for compatibility.
6. Add end-to-end tests for critical golden paths.
7. Create representative performance datasets including skew.
8. Test retries, partial failures, recovery, and idempotency.
9. Keep fixtures synthetic or sanitized and reproducible.
10. Gate releases on high-signal tests; quarantine flaky tests only with owners and deadlines.
11. Track escaped defects back to missing test layers.

## Decision points
Mock external systems for fast logic tests, but use real compatible services before release. Reserve expensive load and DR tests for appropriate stages rather than every commit.

## Common failure patterns
Only happy-path tests, production data copied unsafely, flaky tests ignored indefinitely, tiny datasets, mocks that differ from managed services, and no upgrade/recovery tests.

## Verification
Seed known faults and confirm tests catch them, run suites from clean environments, measure flake rate and duration, and correlate escaped incidents with coverage gaps.

## Expected output
Risk-based test matrix, automated suites, fixtures, CI gates, performance/recovery tests, and quality metrics.

## Stop conditions
Stop when testing requires sensitive production data without approved controls or when destructive failure tests cannot be isolated safely.