# Traffic Routing and Progressive Delivery

## Purpose
Use mesh routing for safe canaries, traffic splitting, mirroring and controlled migrations.

## When to use
Use for version rollout, backend migration, regional shift or experiment routing.

## Inputs
Service versions, SLOs, routing keys, rollout stages, capacity, rollback thresholds.

## Context to inspect
Gateway routes, service discovery, destination subsets, session affinity, retries, client behavior and observability dimensions.

## Core knowledge
Traffic percentage is not user percentage. Retries and sticky sessions can distort distribution. Routing changes require compatible schemas and sufficient capacity on every destination.

## Procedure
1. Define rollout hypothesis and success/error metrics.
2. Verify version compatibility and rollback safety.
3. Confirm destination discovery and health.
4. Choose deterministic header/user routing or weighted routing.
5. Start with minimal exposure.
6. Observe latency, errors, saturation and business signals by version.
7. Increase exposure only after a stable observation window.
8. Abort automatically on agreed thresholds.
9. Remove obsolete routes and subsets after completion.

## Decision points
Use deterministic cohorts when user consistency matters; weighted routing for infrastructure canaries. Use mirroring only for side-effect-safe traffic or sanitized requests.

## Common failure patterns
No per-version telemetry, mirrored writes causing side effects, canary underprovisioning, retry-skewed weights and incompatible database changes.

## Verification
Confirm effective distribution from telemetry, test rollback, validate no unexpected destinations and prove cleanup after promotion.

## Expected output
A staged routing plan with measurable gates and rollback.

## Stop conditions
Stop if version compatibility, capacity, observability or rollback cannot be proven.