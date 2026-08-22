# CD Pipeline Design

## Purpose
Design deployment pipelines that safely promote validated artifacts through environments to production.

## When to use
Use when implementing continuous delivery/deployment, environment promotion, or release orchestration.

## Inputs
Immutable artifacts, environment topology, deployment targets, configuration sources, approval requirements, rollout strategy, health signals, and recovery procedures.

## Preconditions
CI produces a uniquely identifiable artifact and target environments have controlled deployment identities.

## Context to inspect
Inspect deployment manifests, environment secrets, approvals, infrastructure dependencies, health checks, feature flags, rollback commands, concurrency controls, and deployment history.

## Core knowledge
CD should promote the same artifact, apply environment-specific configuration separately, serialize or coordinate changes where target state requires it, and make deployment state observable. A successful command is not equivalent to a healthy release.

## Procedure
1. Define environment progression and promotion criteria.
2. Bind deployment to an immutable artifact identity.
3. Separate configuration and secrets from artifact content.
4. Define deployment concurrency and locking semantics.
5. Implement pre-deploy compatibility checks.
6. Choose rollout mechanics based on risk.
7. Execute deployment with bounded timeouts.
8. Run automated health and business-signal verification.
9. Trigger rollback or halt according to explicit thresholds.
10. Record who/what deployed which artifact and outcome.

## Decision points
Choose automatic production promotion when tests and detection are mature; require deliberate approval for exceptional risk. Prefer declarative deployment when target platforms support reliable reconciliation.

## Common failure patterns
Deploying mutable tags, environment-specific rebuilds, unlimited parallel production deploys, success based only on process exit code, manual configuration drift, and rollback requiring undocumented operator knowledge.

## Verification
Deploy a representative candidate through the full path, confirm artifact identity remains unchanged, exercise failed health checks, and verify deployment records and recovery behavior.

## Expected output
A controlled CD pipeline with promotion, verification, concurrency, and recovery semantics.

## Stop conditions
Stop if the artifact is not immutable, production health signals are absent, required secrets cannot be safely supplied, or rollback/roll-forward for high-risk changes is undefined.