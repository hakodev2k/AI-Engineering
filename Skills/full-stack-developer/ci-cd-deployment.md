# CI/CD and Deployment

## Purpose
Build repeatable pipelines that validate, package, deploy, and recover full-stack applications safely.

## When to use
Creating or improving build pipelines, deployment workflows, environment promotion, or release safety.

## Inputs
Repository, test commands, artifact formats, environments, infrastructure, secrets, rollback strategy.

## Context to inspect
Current workflows, branch protections, artifact provenance, environment configuration, migrations, health checks, deployment history.

## Core knowledge
Build once and promote immutable artifacts where possible. Separate build-time and runtime configuration. Deployment safety requires verification and recovery, not only successful pipeline execution.

## Procedure
1. Define reproducible build inputs.
2. Run lint/static checks and risk-appropriate tests.
3. Produce immutable versioned artifacts.
4. Scan dependencies/artifacts as required.
5. Keep secrets outside source and logs.
6. Define environment-specific configuration explicitly.
7. Sequence schema changes for compatibility.
8. Deploy with health/readiness checks.
9. Run smoke verification after deployment.
10. Provide rollback or forward-recovery path.

## Decision points
Use rolling, blue-green, or canary deployment according to risk, state, and platform support. Separate frontend/backend rollout when contracts remain backward compatible.

## Common failure patterns
Rebuilding per environment, mutable latest tags, secrets in workflows, destructive migrations before compatible code, no smoke tests, and rollback plans that were never exercised.

## Verification
Deploy to a representative environment, verify artifact identity, health checks, smoke tests, migration behavior, and recovery procedure.

## Expected output
Auditable pipeline with deterministic artifacts and safe deployment gates.

## Stop conditions
Stop before production if rollback/recovery is unavailable for a high-risk change.