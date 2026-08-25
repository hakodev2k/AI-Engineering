# Model Registry and Lifecycle

## Purpose
Control model promotion, provenance, compatibility, rollback and retirement across environments.

## When to use
Use when models move beyond local experimentation or multiple versions serve production.

## Inputs
Model artifacts, evaluation evidence, schemas, dependencies, owners, deployment targets and approval policy.

## Context to inspect
Current registry stages, consumers, rollback mechanism, retention and compliance requirements.

## Core knowledge
A model artifact is incomplete without preprocessing, schema, runtime requirements and evaluation provenance. Promotion should be an explicit state transition.

## Procedure
1. Package model and required preprocessing together.
2. Record input/output schemas and compatibility constraints.
3. Attach training lineage and evaluation evidence.
4. Assign immutable version identifiers.
5. Define candidate, approved, deployed, deprecated and retired states as appropriate.
6. Enforce promotion gates and approvals.
7. Track environment deployments separately from registration.
8. Preserve known-good rollback versions.
9. Record ownership and retraining/expiry policy.
10. Retire versions only after consumer and retention checks.

## Decision points
Use automatic promotion only for low-risk systems with strong deterministic gates; require human approval for high-impact changes.

## Common failure patterns
Latest-tag ambiguity, missing preprocessing, deleting rollback artifacts, registry stage confused with deployment state and undocumented schema changes.

## Verification
Resolve a deployed endpoint to exact registered artifacts and lineage; test rollback and compatibility checks.

## Expected output
Auditable model lifecycle with immutable versions and safe promotion/rollback.

## Stop conditions
Stop deployment when provenance, compatibility, ownership or rollback artifact is missing.