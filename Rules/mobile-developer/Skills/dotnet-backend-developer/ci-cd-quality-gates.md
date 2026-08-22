# CI/CD Quality Gates

## Purpose
Create delivery pipelines that quickly detect defects and produce traceable, reproducible .NET artifacts without unsafe deployment shortcuts.

## When to use
New pipelines, flaky builds, release hardening, dependency/security gates, deployment automation.

## Inputs
Repository, branching/release model, build/test commands, artifact target, environments, approval policy.

## Context to inspect
Workflow files, SDK pinning, package restore, tests, scanners, artifacts, secrets, environment protections, rollback method.

## Core knowledge
Build once/promote same artifact reduces drift; deterministic restore and SDK pinning improve reproducibility; gates should be high-signal and proportionate to risk.

## Procedure
1. Pin/declare supported SDK.
2. Restore using locked or controlled dependency policy.
3. Build with warnings/analyzers policy.
4. Run unit and integration tests.
5. Run security/license checks required by policy.
6. Produce versioned immutable artifact.
7. Record commit/version metadata.
8. Deploy through protected environments.
9. Run post-deploy smoke checks.
10. Define rollback/roll-forward path.

## Decision points
Block on deterministic high-risk failures; report lower-confidence advisory findings without making pipelines unusable.

## Common failure patterns
Rebuilding per environment, mutable tags, hidden manual steps, broad deployment credentials, flaky tests ignored, no rollback evidence.

## Verification
Re-run pipeline from clean state, validate artifact checksum/version, test failed-gate behavior and rollback procedure.

## Expected output
Fast, reproducible, auditable delivery with meaningful gates.

## Stop conditions
Escalate production deployment permission or branch-protection changes.