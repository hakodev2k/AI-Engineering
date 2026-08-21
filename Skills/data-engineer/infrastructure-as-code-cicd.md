# Data Infrastructure as Code and CI/CD

## Purpose
Deliver data infrastructure and pipeline changes reproducibly with review, testing, controlled promotion, and rollback evidence.

## When to use
Use for cloud resources, orchestration definitions, permissions, schemas, transformations, jobs, and environment configuration.

## Inputs
Repository, infrastructure definitions, pipeline code, environments, deployment constraints, secrets model, and test strategy.

## Context to inspect
Inspect current provisioning, drift, environment differences, branch/release flow, service identities, migration order, and rollback limitations.

## Core knowledge
Infrastructure and data changes have different rollback properties. Immutable code rollback does not undo published data or destructive schema changes. Delivery pipelines must sequence compatible application, infrastructure, and data migrations.

## Procedure
1. Represent repeatable infrastructure in version control.
2. Parameterize environments without duplicating architecture.
3. Keep secrets outside source and deployment logs.
4. Validate syntax, policy, and plans in CI.
5. Run transformation and contract tests before promotion.
6. Review destructive infrastructure and schema changes explicitly.
7. Deploy in compatibility-preserving order.
8. Record deployed versions and migration state.
9. Add post-deployment smoke and data checks.
10. Define rollback or roll-forward procedure before risky releases.

## Decision points
Use automated deployment for repeatable low-risk changes; require approvals for destructive or high-blast-radius operations. Prefer expand-migrate-contract over synchronized breaking changes.

## Common failure patterns
Manual console drift, environment-specific copied code, secrets in variables committed to repositories, rollback assumptions that ignore data mutation, and deploying schema changes before consumers are compatible.

## Verification
Compare planned and actual infrastructure, deploy to a representative environment, run post-deploy checks, and verify version/audit metadata.

## Expected output
A reproducible delivery path for data code and infrastructure with explicit migration and recovery behavior.

## Stop conditions
Escalate when plans contain unexpected destructive changes, required approvals are missing, or production secrets/permissions are unavailable.