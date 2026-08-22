# Model Registry and Lifecycle

## Purpose
Control model identity, lineage, promotion, rollback, and retirement across environments.

## When to use
Whenever multiple model versions can be trained or deployed.

## Inputs
Model artifacts, evaluation evidence, metadata, environment policy, deployment references.

## Context to inspect
Registry conventions, immutable storage, approval process, compatibility requirements, rollback paths, retention policy.

## Core knowledge
A model version is more than weights: include preprocessing, schema, dependencies, metrics, data/code lineage, and intended use. Promotion should be explicit and auditable.

## Procedure
1. Define immutable model/version identifiers.
2. Register artifact plus preprocessing and schema dependencies.
3. Attach lineage, metrics, constraints, and intended-use metadata.
4. Define lifecycle states and promotion criteria.
5. Require evidence before staging/production transitions.
6. Preserve previous deployable versions for rollback.
7. Track deployments back to exact registry versions.
8. Retire versions according to retention and compliance rules.

## Decision points
Use approval gates for high-impact models; automate promotion only when metrics and risk permit reliable machine-verifiable policy.

## Common failure patterns
Overwriting model files, ambiguous 'latest' references, missing preprocessing versions, deleting rollback candidates, and undocumented manual promotion.

## Verification
Every live endpoint maps to one immutable model package with complete lineage and a tested rollback candidate.

## Expected output
A governed model lifecycle with auditable registry records.

## Stop conditions
Block promotion when lineage, compatibility, evaluation, or required approval is missing.