# CDN Configuration as Code

## Purpose
Manage CDN configuration through reviewable, repeatable, testable automation rather than fragile console-only changes.

## When to use
Use for production CDN estates, multi-environment delivery, frequent rule changes, or compliance requirements.

## Inputs
Current configuration, provider APIs/IaC support, environment model, secrets, approval workflow, rollback requirements.

## Context to inspect
Manual drift, Terraform/provider modules or API tooling, CI/CD, state storage, credentials, validation and deployment history.

## Core knowledge
CDN configuration is production code. Changes to cache keys, routing, WAF, TLS, and edge logic can have global blast radius and need versioning, review, tests, and staged rollout.

## Procedure
1. Inventory current configuration and manual exceptions.
2. Define source-of-truth boundaries.
3. Import or model resources without destructive recreation.
4. Encapsulate reusable policy while exposing meaningful parameters.
5. Add linting and semantic tests for dangerous rule changes.
6. Use least-privilege deployment credentials.
7. Review plans/diffs before apply.
8. Stage or canary high-risk changes.
9. Detect out-of-band drift.
10. Maintain tested rollback paths.

## Decision points
Use declarative IaC for stable resources; use controlled API automation for operations poorly represented declaratively. Avoid abstraction layers that hide critical CDN semantics.

## Common failure patterns
Import mistakes, secrets in state, global applies without staging, console drift, provider-version surprises, and modules too generic to review safely.

## Verification
Reconcile deployed state with source, run tests, inspect plans, perform a controlled change and rollback, and confirm audit history.

## Expected output
A version-controlled CDN delivery pipeline with drift detection, reviews, tests, and rollback.

## Stop conditions
Stop if import/apply proposes destructive replacement of production resources or state/secrets cannot be protected.