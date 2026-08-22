# Cloud CI/CD and Deployment

## Purpose
Build controlled deployment pipelines for cloud infrastructure and applications with repeatability, traceability, and safe rollback.

## When to use
Use for new delivery pipelines, release hardening, environment promotion, or deployment incident reduction.

## Inputs
Repositories, artifacts, environments, test strategy, deployment targets, approval requirements.

## Context to inspect
Pipeline definitions, identities, artifact registries, branch controls, IaC, deployment strategy, secrets, audit logs.

## Core knowledge
Build once and promote immutable artifacts. Pipelines are privileged production systems and should use short-lived identity, least privilege, provenance, and environment controls.

## Procedure
1. Map build, test, artifact, and promotion stages.
2. Produce immutable versioned artifacts.
3. Add dependency, security, and policy checks appropriate to risk.
4. Use workload identity for deployment.
5. Separate environment permissions.
6. Generate IaC plans before infrastructure changes.
7. Choose rolling, blue-green, or canary deployment based on risk.
8. Automate health validation.
9. Define rollback or forward-fix criteria.
10. Preserve deployment audit evidence.

## Decision points
Use progressive delivery for high-impact services when telemetry can determine health. Avoid complex strategies where simple rolling deployment meets risk needs.

## Common failure patterns
Rebuilding per environment, mutable latest tags, shared deployment credentials, manual production drift, and rollback never tested.

## Verification
Deploy a representative change through all stages and verify artifact identity, permissions, health gates, and recovery.

## Expected output
A secure repeatable delivery path with controlled production changes.

## Stop conditions
Stop deployments when health gates fail or required approvals/security evidence are missing.