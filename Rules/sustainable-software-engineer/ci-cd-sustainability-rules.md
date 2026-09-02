# CI/CD Sustainability Rules

## Purpose
Reduce avoidable delivery-pipeline resource use without weakening release confidence, security gates, or reproducibility.

## Scope
Applies to continuous integration, continuous delivery, test execution, artifact creation, preview environments, and deployment automation.

## MUST
- CI/CD optimization MUST identify the expensive stages, execution frequency, cache behavior, and quality gates before changes are made.
- Required security, compliance, regression, and release-safety checks MUST remain enforceable.
- Pipeline changes that skip work MUST use deterministic change-impact logic or an explicitly reviewed equivalent.
- Ephemeral pipeline resources MUST have automatic cleanup controls.

## MUST NOT
- MUST NOT disable required tests or security scans merely to reduce pipeline compute consumption.
- MUST NOT reuse artifacts across incompatible commits, environments, or trust boundaries.
- MUST NOT keep preview or test environments indefinitely without a documented operational need.

## SHOULD
- Prefer incremental testing, affected-project execution, caching, concurrency control, and reusable verified artifacts when evidence supports correctness.
- Monitor repeated retries and flaky jobs because they create both quality risk and avoidable resource consumption.

## Exceptions
Exceptions require the quality gate affected, reason, risk assessment, compensating verification, duration, and approval from the accountable engineering owner.

## Verification
Inspect workflow definitions, execution history, cache hit rates, test-selection logic, security gates, ephemeral-resource cleanup, retry rates, and pipeline resource telemetry.
