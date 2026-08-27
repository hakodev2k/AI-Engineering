# Network CI/CD Pipelines

## Purpose
Create delivery pipelines that validate network intent and automation before controlled deployment.

## When to use
Use for Git-based network changes, template/model repositories, policy-as-code, and automated rollouts.

## Inputs
Repository, schemas, tests, lab environment, deployment workflow, approvals, secrets, and target environments.

## Context to inspect
Branch protections, runners, artifact retention, environment gates, change windows, and audit requirements.

## Core knowledge
Network CI validates static artifacts; CD must add live prechecks, topology-aware rollout, postchecks, and rollback. Pipeline speed must not bypass safety.

## Procedure
1. Validate syntax, schemas, formatting, and policy.
2. Unit-test parsers/renderers/logic.
3. Render candidate configs and semantic diffs.
4. Run lab/integration tests for high-risk changes.
5. Produce immutable reviewed artifacts.
6. Require appropriate approval gates.
7. Retrieve secrets at runtime with least privilege.
8. Run production prechecks.
9. Deploy progressively with pause/rollback gates.
10. Archive evidence and final state.

## Decision points
Auto-deploy low-risk standardized changes only after mature controls; require human approval for high-impact routing/security/core changes.

## Common failure patterns
CI-only confidence, mutable artifacts after review, secrets in pipeline variables/logs, no environment lock, and fleet-wide deployment from merge.

## Verification
Test pipeline failure paths, artifact immutability, approval enforcement, rollback, and audit trail completeness.

## Expected output
Versioned pipeline with validation stages, controlled deployment, evidence, and policy gates.

## Stop conditions
Stop when reviewed artifact differs from deployed artifact, secrets handling is unsafe, or production gates are bypassable.