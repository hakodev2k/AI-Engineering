# CI/CD for AI Artifacts

## Purpose
Build CI/CD pipelines that treat models, prompts, adapters, evaluation sets, retrieval assets, and runtime configuration as first-class release artifacts with traceable validation.

## When to use
Use when automating build, test, promotion, or deployment of AI systems.

## Inputs
Source repository, artifact stores, evaluation jobs, environment definitions, deployment targets, secrets, release policy.

## Preconditions
Artifact ownership, environments, and required gates are defined.

## Context to inspect
Pipeline configuration, model/prompt registries, package locks, container images, evaluation jobs, secret injection, approvals, deployment permissions, and provenance metadata.

## Core knowledge
Traditional CI/CD validates code but may miss behavioral artifacts changed outside source control. AI pipelines must bind code and non-code artifacts into a reproducible release unit and prevent unvalidated mutable dependencies from bypassing gates.

## Procedure
1. Inventory every artifact required to reconstruct runtime behavior.
2. Build immutable artifacts and capture hashes.
3. Run unit, integration, contract, and behavioral evaluation gates.
4. Validate security, privacy, performance, and cost checks appropriate to risk.
5. Generate a release manifest from pipeline outputs.
6. Sign or otherwise protect provenance where required.
7. Separate build from environment promotion.
8. Require approvals for high-risk production stages.
9. Deploy through auditable identities with least privilege.
10. Record deployed artifact identity and pipeline run in production telemetry.

## Decision points
Use manual approval for high-risk transitions, but keep artifact construction automated and deterministic. Prefer promotion of the exact tested artifact over rebuilding per environment.

## Common failure patterns
Rebuilding artifacts during production deployment, using mutable model aliases, storing secrets in pipeline files, skipping behavioral tests, and allowing console changes outside the deployment path.

## Verification
Reproduce the deployed manifest from pipeline records and confirm production telemetry matches the promoted artifact set.

## Expected output
A reproducible AI CI/CD flow with immutable artifacts, gates, provenance, approvals, and deployment evidence.

## Stop conditions
Stop when production behavior depends on untracked artifacts or when pipeline identities have permissions broader than required.