# AWS CI/CD and Deployment Strategy

## Purpose
Design secure deployment pipelines with reproducible artifacts, progressive delivery, automated validation, and fast rollback.

## When to use
Use for new pipelines, deployment failures, release-risk reduction, multi-account deployments, or supply-chain hardening.

## Inputs
Source repository, artifact type, environments, approvals, test suite, release frequency, rollback requirements, deployment targets.

## Context to inspect
CodePipeline/CodeBuild or external CI, IAM roles, artifact stores, ECR, signing/provenance, deployment configs, environment promotion, CloudTrail.

## Core knowledge
Build once and promote the same immutable artifact. Separate pipeline identity from workload identity. Deployment strategies trade speed, cost, and blast radius.

## Procedure
1. Define stages from source through production.
2. Produce immutable, versioned artifacts.
3. Add unit, integration, security, and policy checks appropriate to risk.
4. Use short-lived cross-account deployment roles.
5. Promote artifacts rather than rebuild per environment.
6. Select rolling, blue/green, or canary rollout based on rollback needs.
7. Define automated health gates and rollback triggers.
8. Protect production approvals without creating manual bottlenecks everywhere.
9. Record deployment metadata for incident correlation.
10. Practice rollback and failed-deployment recovery.

## Decision points
Use canary/blue-green for high-risk or user-facing changes when extra capacity/complexity is justified. Use direct rolling updates for low-risk stateless services with strong rollback.

## Common failure patterns
Rebuilding artifacts per environment, static AWS keys in CI, no rollback test, mutable image tags, manual console deploys, and approvals without evidence.

## Verification
Run a controlled failed deployment, validate rollback, artifact integrity, permissions, and audit trail.

## Expected output
Pipeline architecture, security model, deployment strategy, and recovery evidence.

## Stop conditions
Escalate when production rollback is impossible, artifact provenance is unknown, or deployment credentials violate security policy.