# Progressive Delivery

## Purpose
Reduce release blast radius by exposing changes gradually while evaluating technical and business health.

## When to use
Use for high-impact services, uncertain behavioral changes, large user populations, or releases where rapid rollback is valuable.

## Inputs
Deployment platform, traffic routing capabilities, feature flags, health metrics, business KPIs, cohort rules, and rollback controls.

## Preconditions
The system can distinguish release cohorts or traffic slices and observe their outcomes with low enough latency.

## Context to inspect
Inspect load balancers, orchestrators, feature flag systems, telemetry dimensions, alert thresholds, session affinity, data compatibility, and background processing.

## Core knowledge
Canary, blue-green, ring, and feature-flag rollouts control different dimensions. Progressive delivery requires comparable telemetry and predetermined decision thresholds; gradual exposure without evaluation only delays failures.

## Procedure
1. Identify likely failure modes and affected signals.
2. Choose a rollout unit: instances, traffic percentage, users, tenants, regions, or features.
3. Define baseline and candidate cohorts.
4. Define automatic hold, advance, and rollback thresholds.
5. Verify schema and protocol compatibility across mixed versions.
6. Start with the smallest meaningful exposure.
7. Observe for a duration appropriate to traffic and failure latency.
8. Advance in bounded stages.
9. Halt or recover when thresholds fail.
10. Remove temporary rollout controls after stable completion.

## Decision points
Use canaries for runtime behavior comparison, blue-green for fast environment switch, feature flags for user-level exposure, and rings for operationally distinct cohorts. Combine only when added complexity materially reduces risk.

## Common failure patterns
No baseline comparison, canary traffic too small to detect defects, metrics aggregated across versions, incompatible database changes, long-lived stale flags, and manual advancement driven by intuition rather than evidence.

## Verification
Simulate a degraded candidate and confirm automated detection and halt/rollback. Verify telemetry can segment baseline versus candidate and rollout state is auditable.

## Expected output
A progressive rollout plan and automation with explicit cohorts, thresholds, observation windows, and recovery behavior.

## Stop conditions
Stop if candidate health cannot be isolated, mixed-version compatibility is unsafe, or rollback cannot complete within acceptable impact time.