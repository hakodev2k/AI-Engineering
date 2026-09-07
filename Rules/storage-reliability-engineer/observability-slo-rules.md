# Observability and SLO Rules

## Purpose
Make storage reliability measurable and diagnosable.

## Scope
Applies to storage service-level indicators, metrics, logs, traces, health events, and alerts.

## MUST
- Define SLIs for availability, latency, errors, durability risk, capacity, and recovery where applicable.
- Alert on user-impacting symptoms and imminent reliability threats with clear ownership.
- Preserve enough telemetry to correlate client, network, node, device, and control-plane behavior.

## MUST NOT
- Use component health alone as evidence of service health.
- Create alerts without an actionable response or owner.
- Log secrets, credentials, or unnecessary sensitive payload data.

## SHOULD
- Track error-budget consumption and tail latency.
- Prefer high-cardinality diagnostics only when cost and privacy controls are understood.

## Exceptions
Telemetry gaps require documented impact, compensating checks, and remediation priority.

## Verification
Review dashboards, alert tests, SLO calculations, retention settings, incident timelines, and telemetry coverage.