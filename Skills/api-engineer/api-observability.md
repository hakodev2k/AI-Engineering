# API Observability

## Purpose
Make API behavior diagnosable through correlated logs, metrics, traces, and meaningful service indicators.

## When to use
Use for production APIs, incident preparation, or observability gaps.

## Inputs
API topology, SLOs, telemetry platform, data-classification rules, and incident history.

## Context to inspect
Request logging, trace propagation, metric labels, dashboards, alerts, and sensitive-data handling.

## Core knowledge
Observe latency, traffic, errors, and saturation. Correlation across gateway, service, database, and dependencies is more valuable than isolated verbose logs.

## Procedure
1. Define service indicators and SLOs.
2. Propagate trace/correlation context.
3. Emit structured request outcome logs.
4. Capture latency and status metrics.
5. Trace meaningful internal and dependency spans.
6. Redact credentials and sensitive payloads.
7. Build dashboards around user-visible behavior.
8. Alert on actionable symptoms.
9. Validate telemetry during failure drills.

## Decision points
Use high-cardinality dimensions in traces/logs rather than uncontrolled metric labels. Sample traces carefully while preserving errors and slow requests.

## Common failure patterns
Logging entire payloads, alerts on raw CPU alone, missing correlation IDs, high-cardinality metric explosions, and dashboards without SLO context.

## Verification
A test incident can be followed from external request to root dependency using available telemetry.

## Expected output
An actionable API observability baseline.

## Stop conditions
Escalate if telemetry requirements conflict with privacy or retention policy.