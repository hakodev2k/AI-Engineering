# Production Readiness Review

## Purpose
Assess whether a significant system or change is ready for production across reliability, operability, security, capacity, data safety, deployment, and ownership dimensions.

## When to use
Use before launching critical services, major migrations, high-risk features, new shared platforms, or materially changing failure characteristics.

## Inputs
Architecture, deployment plan, SLOs, load tests, runbooks, alerts, dashboards, threat model, rollback plan, data migration plan, ownership.

## Preconditions
The implementation is sufficiently complete to test realistic production behavior.

## Context to inspect
Failure modes, dependencies, capacity headroom, backups, restore procedures, feature flags, deployment automation, observability, on-call coverage, security controls, and known limitations.

## Core knowledge
Production readiness means the system can be operated safely, not merely that code works. Readiness requires detection, diagnosis, mitigation, rollback, recovery, ownership, and tested assumptions.

## Procedure
1. Confirm launch scope and user impact.
2. Review SLOs, capacity, and dependency assumptions.
3. Exercise expected failure modes and degradation paths.
4. Validate dashboards, alerts, logs, and traces.
5. Review security and sensitive-data controls.
6. Test deployment and rollback procedures.
7. Validate backups, restore, reconciliation, or migration safety where applicable.
8. Confirm operational ownership and escalation paths.
9. List launch blockers and accepted residual risks.
10. Define post-launch metrics and rollback thresholds.

## Decision points
Block launch for unbounded data-loss, security, or recovery risks. Accept minor operational debt only with owners and time-bounded remediation. Prefer staged rollout when uncertainty remains.

## Common failure patterns
Checklist completion without testing, no rollback, alerts without runbooks, untested restore, insufficient capacity headroom, and unclear on-call ownership.

## Verification
Run representative tests, validate rollback and recovery evidence, confirm observability signals, and verify accountable owners accept remaining risk.

## Expected output
A launch readiness decision with blockers, evidence, residual risks, rollout guardrails, and ownership.

## Stop conditions
Stop and escalate when destructive migration, unresolved critical security findings, untested recovery, or missing production ownership prevents a safe launch.