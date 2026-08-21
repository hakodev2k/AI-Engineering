# CI/CD Pipeline Design

## Purpose
Design delivery pipelines that are fast, repeatable, auditable, and safe enough for production change.

## When to use
Use when creating or redesigning build, test, package, deploy, promotion, or rollback workflows.

## Inputs
Repository, branching model, environments, build tooling, artifact format, test suites, deployment targets, compliance needs.

## Context to inspect
Existing workflows, release cadence, failure history, secrets model, artifact registry, environment approvals, rollback procedure.

## Core knowledge
Pipelines should build once, promote immutable artifacts, fail early, keep credentials short-lived, separate validation from deployment, and expose evidence. Optimize developer feedback without weakening release safety.

## Procedure
1. Map commit-to-production stages and owners.
2. Identify required checks and release gates.
3. Build immutable versioned artifacts once.
4. Parallelize independent validation.
5. Separate environment configuration from artifacts.
6. Add deployment strategy and rollback path.
7. Add provenance, logs, and traceable approvals.
8. Define timeout, retry, and failure behavior.
9. Measure pipeline duration and flaky stages.
10. Test failure and rollback scenarios.

## Decision points
Choose trunk-based vs release branches based on delivery model; use manual approval only where risk justifies latency; prefer canary/blue-green when rollback cost is high.

## Common failure patterns
Rebuilding per environment, long serial pipelines, hidden mutable dependencies, broad permanent credentials, deployment without rollback, ignoring flaky tests.

## Verification
Run from clean commit, verify artifact identity across environments, exercise a failed deployment, confirm audit trail and rollback.

## Expected output
Documented pipeline stages, gates, artifacts, deployment strategy, evidence, and recovery path.

## Stop conditions
Stop for missing production permissions, undefined rollback, or compliance requirements that cannot be satisfied.