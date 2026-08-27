# Progressive Delivery and Traffic Splitting

## Purpose
Use gateway traffic controls to release backend or gateway changes gradually with measurable rollback criteria.

## When to use
Use for canary releases, blue/green cutovers, experiments, regional migrations, or risky backend upgrades.

## Inputs
Candidate/stable backends, rollout criteria, segmentation key, SLOs, rollback plan.

## Context to inspect
Session affinity, state compatibility, schema changes, caching, retry behavior, metric quality, client identity.

## Core knowledge
Understand weighted routing, deterministic bucketing, canary analysis, error-budget impact, state compatibility, and rollback safety.

## Procedure
1. Define success and abort metrics before shifting traffic.
2. Confirm candidate and stable versions can coexist safely.
3. Choose random weighting or deterministic cohort routing.
4. Start with a small blast radius.
5. Compare latency, errors, saturation, and business-safe signals.
6. Increase exposure only when gates pass.
7. Freeze or roll back automatically/manual according to defined thresholds.
8. Remove temporary split rules after completion.

## Decision points
Use deterministic cohorts when user/session consistency matters; weighted random routing for stateless homogeneous traffic. Never use traffic splitting to hide incompatible shared-state migrations.

## Common failure patterns
No rollback threshold, retry traffic biasing weights, inconsistent sticky routing, canary too small to detect rare failures, stale rules after release.

## Verification
Simulate rollback, confirm traffic proportions, validate cohort consistency, and compare candidate versus stable telemetry.

## Expected output
A staged rollout configuration with objective gates and tested rollback.

## Stop conditions
Stop immediately when safety thresholds are breached or coexistence assumptions fail.