# Release Strategy

## Purpose
Design a repeatable release approach that balances delivery speed, reliability, auditability, and recovery.

## When to use
Use when establishing or revising how software moves from validated source to production, especially across multiple services, environments, or teams.

## Inputs
Repository structure, deployment topology, environments, release cadence, risk tolerance, compliance constraints, dependency graph, SLOs, and incident history.

## Preconditions
Understand the current build/deploy path and identify authoritative artifacts and production owners.

## Context to inspect
Inspect CI/CD workflows, branching/tagging conventions, artifact registries, environment promotion rules, approval gates, rollback mechanisms, feature flags, and observability.

## Core knowledge
A release should promote immutable, traceable artifacts rather than rebuild source per environment. Strategy must define release units, versioning, promotion, rollout, verification, rollback, and ownership. Faster delivery is valuable only when recovery and detection are strong enough.

## Procedure
1. Identify release units and their dependency relationships.
2. Define the source state that constitutes a releasable candidate.
3. Define immutable artifact creation and provenance.
4. Define environment promotion and configuration separation.
5. Classify release risk and required controls.
6. Choose rollout patterns appropriate to blast radius.
7. Define automated pre-release and post-release verification.
8. Define rollback or roll-forward criteria.
9. Define release evidence and audit trail.
10. Exercise the process on representative normal and failure scenarios.

## Decision points
Choose independent service releases when coupling permits; coordinated releases when compatibility cannot be maintained. Prefer progressive delivery for high-impact changes. Use manual approval only where human judgment materially reduces risk.

## Common failure patterns
Rebuilding artifacts per environment, mutable tags, undocumented manual steps, synchronized releases caused by accidental coupling, approval gates without evidence, and rollback plans that have never been tested.

## Verification
Verify artifact identity from build through production, successful promotion in a staging-equivalent environment, automated health checks, recovery execution, and traceability from production version to source and pipeline.

## Expected output
A documented and executable release strategy with clear controls, owners, evidence, rollout, and recovery behavior.

## Stop conditions
Stop when production ownership is unclear, artifact provenance cannot be established, destructive changes lack recovery design, or required compliance controls are unknown.