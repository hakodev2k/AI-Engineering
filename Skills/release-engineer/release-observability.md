# Release Observability

## Purpose
Make release state and release-caused behavior visible enough to detect regressions and diagnose failures quickly.

## When to use
Use when designing telemetry, dashboards, alerts, or release annotations for deployment systems.

## Inputs
Telemetry stack, deployment metadata, service topology, SLOs, release events, incident history, and critical user journeys.

## Preconditions
Applications and infrastructure emit usable telemetry and release identity can be propagated.

## Context to inspect
Inspect log fields, metric labels, trace resource attributes, dashboards, alert rules, deployment event streams, and retention.

## Core knowledge
Every production signal should be correlatable with version, environment, and relevant rollout cohort. Release annotations help distinguish change-induced regressions from background noise. Avoid unbounded-cardinality dimensions.

## Procedure
1. Define the release identity fields required for correlation.
2. Propagate version/build metadata into runtime telemetry.
3. Emit deployment start, stage, success, failure, and rollback events.
4. Build views comparing baseline and candidate health.
5. Add release-specific dashboards for critical signals.
6. Define alerts on meaningful regression thresholds.
7. Ensure traces cross changed dependencies where possible.
8. Link release records to dashboards and incidents.
9. Test telemetry during a staged deployment.
10. Review signal usefulness after incidents.

## Decision points
Use high-cardinality identifiers in tracing/log search rather than metric labels when cardinality cost is unsafe. Alert on user impact and SLO symptoms rather than every deployment event.

## Common failure patterns
No version field, dashboards aggregated across candidate and baseline, deployment logs isolated from service telemetry, noisy alerts that operators ignore, and missing business signals.

## Verification
Deploy two versions concurrently and confirm dashboards can separate them, deployment events align with telemetry changes, and an induced regression is detectable.

## Expected output
Release-aware telemetry, dashboards, and alerts that support rollout decisions and diagnosis.

## Stop conditions
Stop high-risk progressive rollout when candidate telemetry cannot be distinguished or critical release health signals are unavailable.