# Senior Code Review

## Purpose
Review backend changes for correctness, security, performance, operability, and maintainability while focusing feedback on material risk.

## When to use
Pull requests, design-sensitive refactors, incident fixes, dependency upgrades.

## Inputs
Diff, requirement, tests, architecture context, production constraints.

## Context to inspect
Changed code plus affected call paths, data contracts, DB queries/migrations, auth, config, telemetry, tests.

## Core knowledge
A review should verify behavior and risk, not enforce personal style. Severity should reflect production impact and likelihood.

## Procedure
1. Understand intended behavior and acceptance criteria.
2. Identify trust/data/transaction boundaries touched.
3. Trace main and failure paths.
4. Check authorization/validation/security implications.
5. Inspect DB/query and concurrency impact.
6. Check cancellation/timeouts/retries for I/O.
7. Verify observability and operational behavior.
8. Evaluate tests against risk.
9. Flag compatibility/migration issues.
10. Separate blocking defects from optional improvements.

## Decision points
Request abstraction only when it reduces real duplication/coupling or protects a meaningful boundary. Avoid blocking on subjective formatting handled by tooling.

## Common failure patterns
Reviewing only changed lines, style nitpicks hiding critical issues, missing negative paths, approving unverified performance claims, requiring patterns mechanically.

## Verification
Reviewer can explain the change, key risks are tested/evidenced, blocking comments map to concrete failure scenarios.

## Expected output
Prioritized actionable review feedback with rationale.

## Stop conditions
Escalate architectural/security decisions outside reviewer authority.