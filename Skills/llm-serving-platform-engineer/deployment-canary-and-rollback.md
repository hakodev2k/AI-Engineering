# Deployment, Canary, and Rollback

## Purpose
Release model, runtime, kernel, configuration, and infrastructure changes with measurable risk control and rapid rollback.

## When to use
Use for every production-serving change capable of affecting quality, latency, capacity, or correctness.

## Inputs
Change set, baseline metrics, evaluation results, deployment topology, SLOs, rollback artifact, compatibility matrix.

## Context to inspect
CI/CD, artifact registry, model aliases, routing weights, health gates, autoscaling, dashboards, and rollback automation.

## Core knowledge
Serving releases can regress both software behavior and model quality. Canary gates should combine correctness, model evaluation where relevant, latency, errors, memory, and capacity. Rollback must restore compatible model-runtime pairs.

## Procedure
1. Identify change dimensions and blast radius. 2. Produce immutable artifacts. 3. Run offline correctness/evaluation and load tests. 4. Verify rollback artifact compatibility. 5. Deploy to isolated capacity. 6. Warm fully before traffic. 7. Shift a small representative traffic slice. 8. Compare canary and baseline with predefined thresholds. 9. Expand gradually only while gates pass. 10. Roll back automatically/manual when thresholds fail. 11. Record outcome and anomalies.

## Decision points
Use shadow traffic for changes that can be evaluated without user-visible responses; use canaries for true end-to-end validation. Avoid mixing multiple high-risk dimensions in one release when attribution matters.

## Common failure patterns
Mutable tags, canaries receiving unrepresentative traffic, no warmup, comparing different workload mixes, rollback requiring a rebuild, and changing model plus runtime plus scheduler simultaneously.

## Verification
Rehearse rollback and demonstrate traffic restoration, artifact compatibility, and SLO recovery.

## Expected output
A gated rollout plan, immutable release identity, canary evidence, and tested rollback path.

## Stop conditions
Stop if rollback is unavailable, baseline telemetry is missing, or compatibility between artifacts and runtime is unverified.