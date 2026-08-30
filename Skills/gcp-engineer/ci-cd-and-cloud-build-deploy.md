# CI/CD and Cloud Build/Deploy

## Purpose
Design secure delivery pipelines for GCP workloads using build provenance, artifact promotion, deployment controls, and rollback.

## When to use
Use for application delivery, infrastructure deployment, supply-chain hardening, or unreliable release processes.

## Inputs
Repositories, artifact types, target runtimes, environments, approval requirements, test gates, and rollback model.

## Context to inspect
Cloud Build triggers, worker pools, Artifact Registry, service accounts, substitutions, deploy manifests, approvals, provenance, and release history.

## Core knowledge
Build and runtime identities should be separate. Artifacts should be built once and promoted, not rebuilt per environment. Deployment permissions are high privilege.

## Procedure
1. Define source-to-production stages.
2. Separate build, deploy, and runtime identities.
3. Minimize build-network access.
4. Store immutable artifacts in Artifact Registry.
5. Run tests and security checks before promotion.
6. Generate provenance where required.
7. Promote the same artifact through environments.
8. Use progressive deployment and automated rollback where supported.
9. Record deployment metadata and approvals.
10. Rehearse rollback.

## Decision points
Use private pools when builds require private connectivity or isolation. Add manual approval only for risks that cannot be automated safely.

## Common failure patterns
Long-lived deployment keys, mutable tags, rebuilding per environment, broad deploy roles, and rollback that depends on source recompilation.

## Verification
Trace a production artifact back to source and build, test rollback, and inspect IAM around deploy identities.

## Expected output
A secure and reproducible release pipeline.

## Stop conditions
Stop if artifact provenance or rollback cannot be established for a high-risk release.