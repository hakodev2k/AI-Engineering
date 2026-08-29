# CloudWatch Observability

## Purpose
Build useful AWS observability using metrics, logs, traces, dashboards, alarms, and service-level signals.

## When to use
Use for new services, incident readiness, noisy alerts, missing telemetry, or operational maturity improvements.

## Inputs
Service architecture, critical user journeys, SLOs, known failure modes, logs, metrics, traces, on-call model.

## Context to inspect
CloudWatch metrics/log groups, retention, alarms, dashboards, Logs Insights, X-Ray/OTel, application telemetry, notification routing.

## Core knowledge
Telemetry should support detection, diagnosis, and decision-making. High-cardinality dimensions can be costly. Alarms should represent actionable conditions rather than every anomalous metric.

## Procedure
1. Identify critical service outcomes and dependencies.
2. Define SLIs such as availability, latency, error rate, and saturation.
3. Emit structured logs with correlation identifiers.
4. Add metrics for traffic, errors, latency, saturation, and business-critical events.
5. Instrument traces across distributed calls where useful.
6. Set log retention intentionally.
7. Build dashboards around operational questions.
8. Create actionable alarms with owner/runbook links.
9. Test alarm routing and incident workflows.

## Decision points
Use custom metrics only when logs or native metrics cannot support the required decision. Prefer percentile latency over averages for tail-sensitive systems.

## Common failure patterns
Noisy alarms, no ownership, unlimited log retention, secrets in logs, dashboard vanity metrics, and missing correlation across services.

## Verification
Trigger representative failures, confirm alarms and traces identify them, and verify operators can answer key diagnostic questions.

## Expected output
Telemetry schema, dashboards, alarms, retention policy, and runbooks.

## Stop conditions
Escalate if required telemetry could expose sensitive data or observability cost grows without operational value.