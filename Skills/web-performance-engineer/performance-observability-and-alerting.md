# Performance Observability and Alerting

## Purpose
Build production observability that detects meaningful web-performance degradation quickly while minimizing noisy or unactionable alerts.

## When to use
Use when establishing RUM monitoring, defining performance SLOs, adding release observability, or replacing dashboard-only monitoring with operational signals.

## Inputs
RUM metrics, route taxonomy, deployment metadata, traffic volume, business journeys, incident history, ownership map.

## Context to inspect
Review sampling, metric freshness, data latency, cardinality, device/network segmentation, known seasonality, release markers, and on-call ownership.

## Core knowledge
Performance alerts should represent user impact and sustained change. Percentile distributions and affected traffic matter more than averages. Static thresholds catch absolute failure; baseline/anomaly logic catches regressions. Every alert needs diagnostic dimensions and a response path.

## Procedure
1. Select a small set of user-centric metrics for critical journeys.
2. Define target percentiles and minimum traffic/sample requirements.
3. Establish absolute SLO/budget thresholds.
4. Add regression detection relative to recent stable baselines.
5. Segment only dimensions that lead to different actions.
6. Attach release, route, browser/device, and geography context.
7. Suppress known low-volume and instrumentation-noise conditions.
8. Create alert ownership, severity, and runbook links.
9. Test alerts with known historical regressions or controlled degradation.
10. Review false positives, missed incidents, and threshold drift regularly.

## Decision points
Page immediately only for broad, high-impact user degradation; route lower-severity issues to asynchronous triage. Use anomaly detection when traffic is seasonal, but retain hard safety thresholds.

## Common failure patterns
Alerting on global averages; one threshold for every route; no minimum sample size; alerts without release context; dashboard metrics with no owner; paging on telemetry gaps as if they were application regressions.

## Verification
Demonstrate that representative regressions trigger expected alerts, healthy variation does not, and responders can identify affected segments from the alert payload.

## Expected output
A performance SLO/alert specification, dashboards, ownership, and tested runbooks.

## Stop conditions
Escalate when telemetry quality cannot support reliable alerting or required on-call ownership is undefined.