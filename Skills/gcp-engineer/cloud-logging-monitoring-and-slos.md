# Cloud Logging, Monitoring, and SLOs

## Purpose
Build production observability using Cloud Logging, Cloud Monitoring, traces, dashboards, alerting, and service-level objectives.

## When to use
Use when launching services, reducing alert noise, diagnosing incidents, or formalizing reliability targets.

## Inputs
User journeys, availability target, latency/error objectives, telemetry sources, on-call model, and retention requirements.

## Context to inspect
Log sinks, metrics, uptime checks, dashboards, alerts, traces, SLOs, notification channels, and log-based metrics.

## Core knowledge
Monitoring should represent user-visible service health. SLOs require meaningful SLIs and error budgets; alerts should be actionable and tied to operator response.

## Procedure
1. Identify critical user journeys.
2. Define availability, latency, and correctness SLIs.
3. Set realistic SLO targets.
4. Instrument structured logs with trace correlation.
5. Expose infrastructure and application metrics.
6. Build service dashboards before incident dashboards.
7. Alert on symptoms and error-budget burn.
8. Route logs to required retention/security sinks.
9. Test notifications and runbooks.
10. Review noisy or unused telemetry.

## Decision points
Use logs for discrete events, metrics for trends/alerts, and traces for request-path diagnosis. Avoid paging on resource utilization alone unless it predicts user impact.

## Common failure patterns
High-cardinality metrics, unbounded logging cost, alerts without runbooks, and SLOs based only on infrastructure uptime.

## Verification
Trigger synthetic failures, confirm telemetry correlation, and validate burn-rate alerts against known incidents.

## Expected output
An actionable observability and SLO framework.

## Stop conditions
Stop if service ownership or user-impact definitions are unavailable.