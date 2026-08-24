# CI/CD for Machine Learning

## Purpose
Build automated quality and delivery gates for ML code, data contracts, pipelines, model artifacts, infrastructure, and deployments.

## When to use
Use when ML changes move repeatedly from source control to training or production environments.

## Inputs
Repository, tests, pipeline definitions, infrastructure code, model validation gates, registry, deployment targets, environment policy.

## Preconditions
Artifacts and environments can be versioned and promoted explicitly.

## Context to inspect
Existing CI, build agents, credentials, branch policy, artifact registries, test suites, environment differences, and deployment tooling.

## Core knowledge
ML CI/CD has two linked flows: software delivery and model lifecycle. Not every code change should retrain; not every retrained model should deploy. Gates should distinguish code correctness, data compatibility, model quality, and operational readiness.

## Procedure
1. Define change classes and required checks.
2. Run formatting/static/unit tests on code changes.
3. Validate schemas and pipeline contracts.
4. Build immutable runtime/model artifacts.
5. Run integration and representative training smoke tests.
6. Execute model validation gates for candidate artifacts.
7. Promote only immutable registry versions.
8. Deploy progressively with rollback controls.
9. Verify post-deployment metrics.
10. Preserve provenance from source commit to deployed version.

## Decision points
Retrain on merge, schedule, or data trigger based on cost and freshness; automatic deployment only for well-bounded risk classes.

## Common failure patterns
Production retraining from unreviewed code, mutable image tags, secrets in CI variables without scope control, expensive full training on every commit, and deployment success without model-quality verification.

## Verification
Trace a deployed version back to passing checks, artifact digest, source commit, data version, validation evidence, and deployment verification.

## Expected output
Pipeline stages, gate matrix, credential boundaries, promotion strategy, and provenance evidence.

## Stop conditions
Stop promotion on failed gates, unverifiable provenance, incompatible data contracts, or unavailable rollback path.