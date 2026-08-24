# CI/CD and Release Engineering

## Purpose
Create safe delivery pipelines for data-platform code, schemas, infrastructure, and runtime configuration with progressive verification and rollback strategies.

## When to use
Use when automating deployments, reducing release risk, or standardizing multi-environment promotion.

## Inputs
Repositories, artifact types, environments, tests, IaC, migration requirements, approval policy, and rollback capabilities.

## Context to inspect
Current workflows, credentials, artifact registry, branch protections, environment drift, deployment history, and failure recovery.

## Core knowledge
Data releases can be backward-incompatible even when code rolls back. Schema and state migrations require expand/contract or forward-fix strategies. Build once and promote immutable artifacts.

## Procedure
1. Inventory deployable artifacts and dependencies.
2. Define quality gates: lint, unit, contract, integration, security, and policy checks.
3. Produce immutable versioned artifacts once.
4. Promote the same artifacts across environments.
5. Separate deployment from activation where feature/config flags help.
6. Sequence schema/state changes for compatibility.
7. Use least-privilege deployment identities.
8. Add post-deploy smoke and data-path checks.
9. Define rollback or forward-recovery per artifact type.
10. Record deployment evidence and provenance.
11. Exercise failed-release recovery periodically.

## Decision points
Automate low-risk reversible changes; require approval for destructive, privileged, or high-blast-radius operations. Prefer canary/progressive rollout when traffic or workload segmentation permits meaningful comparison.

## Common failure patterns
Rebuilding per environment, mutable latest tags, rollback assumptions after irreversible migration, production-only manual steps, excessive deployment privileges, and tests that never exercise data compatibility.

## Verification
Deploy to a clean non-production environment, validate provenance, intentionally fail a stage, test rollback/forward recovery, and confirm post-deploy SLO and data checks.

## Expected output
Delivery pipeline, quality gates, artifact/version policy, migration sequencing, recovery procedure, and release audit trail.

## Stop conditions
Stop when a release contains irreversible changes without recovery, required approvals are absent, or artifact provenance cannot be established.