# Azure CI/CD Deployment Strategy

## Purpose
Design safe automated Azure deployments with controlled identities, environment promotion, validation, rollback, and auditability.

## When to use
Use for application/infrastructure pipelines, deployment modernization, environment promotion, or release-related incidents.

## Inputs
Repositories, artifacts, environments, IaC, application packaging, test suites, approval requirements, deployment targets, and rollback constraints.

## Context to inspect
Inspect pipeline definitions, service connections/federated identities, branch protections, artifacts, environment approvals, deployment history, secrets, and Azure target configuration.

## Core knowledge
Build once and promote immutable artifacts when practical. Pipeline identity should use least privilege and short-lived federation rather than static credentials. Deployment strategy must match statefulness and rollback capability.

## Procedure
1. Map source-to-production artifact flow.
2. Separate build validation from deployment.
3. Produce immutable versioned artifacts.
4. Use workload identity federation or managed identity where supported.
5. Scope deployment permissions by environment and resource boundary.
6. Add IaC validation and change preview.
7. Define environment-specific configuration outside artifact binaries.
8. Select rolling, slot, canary, or blue/green deployment based on platform and risk.
9. Add post-deployment health checks and rollback/forward-fix criteria.
10. Preserve deployment evidence and audit trail.

## Decision points
Use progressive delivery for high-risk changes when traffic control and observability support it. Roll back stateless application artifacts readily; prefer forward fixes for database changes that cannot safely reverse.

## Common failure patterns
Rebuilding artifacts per environment, subscription Owner pipeline identities, long-lived secrets, production-only configuration surprises, no post-deploy validation, and assuming database rollback is symmetric.

## Verification
Deploy the same artifact through a non-production promotion path, test failed health checks, validate permission boundaries, and exercise rollback or forward-fix procedures.

## Expected output
A repeatable Azure delivery pipeline with immutable artifacts, least privilege, deployment safeguards, and recovery procedures.

## Stop conditions
Stop when deployment identity is excessively privileged without approval, schema changes lack safe migration strategy, or production rollback behavior is unknown.