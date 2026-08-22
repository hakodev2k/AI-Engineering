# Platform Testing Strategy

## Purpose
Validate shared platform contracts, infrastructure changes, failure behavior, and consumer compatibility before production impact.

## When to use
Use when building or changing platform APIs, IaC modules, policies, pipelines, clusters, or golden paths.

## Inputs
Platform contracts, architecture, failure modes, consumers, environments, and release process.

## Context to inspect
Unit tests, integration environments, policy tests, contract suites, load tests, upgrade tests, and incident history.

## Core knowledge
Platform tests should cover interfaces and operational behavior, not only implementation. Test pyramids vary because infrastructure integration evidence is often essential.

## Procedure
1. Identify critical contracts and failure modes.
2. Unit-test deterministic logic and policy.
3. Validate IaC plans and modules in isolated accounts or projects.
4. Add API and consumer contract tests.
5. Exercise representative golden paths end to end.
6. Test rollback, upgrade, and dependency failure.
7. Load-test shared bottlenecks.
8. Gate releases using risk-appropriate evidence.

## Decision points
Use mocks for fast deterministic logic; require real integration tests where provider or control-plane behavior matters.

## Common failure patterns
Mock-only confidence, tests sharing mutable environments, no destructive-path testing, flaky end-to-end suites, and ignored upgrade behavior.

## Verification
A release candidate passes defined suites and failure drills with reproducible evidence.

## Expected output
A layered test strategy with environments, contracts, gates, ownership, and failure coverage.

## Stop conditions
Stop release when critical contracts or rollback behavior cannot be verified.