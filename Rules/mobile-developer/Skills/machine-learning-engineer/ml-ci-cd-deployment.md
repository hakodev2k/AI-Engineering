# ML CI/CD and Deployment

## Purpose
Automate safe validation, packaging, rollout, and rollback of ML code and model artifacts.

## When to use
When models move between development, staging, and production repeatedly.

## Inputs
Repository, tests, model registry, deployment manifests, environment policy, SLOs, approval rules.

## Context to inspect
Build reproducibility, artifact identity, infrastructure, secrets, compatibility, rollout mechanism, observability.

## Core knowledge
ML delivery has two changing artifacts: software and model/data lineage. Deployment gates should verify both. Progressive exposure reduces blast radius.

## Procedure
1. Define CI gates for code, data contracts, integration, and model-quality regression.
2. Build immutable runtime and model references.
3. Sign/record provenance where required.
4. Deploy exact artifacts to staging and run smoke/load checks.
5. Promote using canary, shadow, or blue-green strategy as appropriate.
6. Compare live operational/model signals against control.
7. Abort automatically on hard guardrails.
8. Keep tested rollback references.
9. Record deployment-to-model lineage.

## Decision points
Use shadowing for behavior comparison without decision impact; canary for gradual real exposure; blue-green when fast environment rollback is valuable.

## Common failure patterns
Deploying 'latest', rebuilding artifacts per environment, model changes bypassing CI, no live guardrails, and rollback requiring retraining.

## Verification
A deployment and forced rollback can be executed using immutable artifacts while preserving audit lineage.

## Expected output
A repeatable ML delivery pipeline with promotion gates and rollback.

## Stop conditions
Block production when artifact identity, evaluation, permissions, or rollback are unverified.