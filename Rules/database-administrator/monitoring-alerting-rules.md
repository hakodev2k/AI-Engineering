# Monitoring and Alerting

## Purpose
Detect database conditions that threaten availability, durability, security, or performance before they become uncontrolled incidents.

## Scope
Health, capacity, replication, backup, latency, errors, locks, resource saturation, and security signals.

## MUST
- Critical databases MUST expose health and saturation signals sufficient to diagnose common failure modes.
- Alerts MUST be actionable, severity-classified, routed to an accountable responder, and tested.
- Capacity exhaustion, backup failure, replication failure, and availability loss MUST have explicit detection.
- Monitoring gaps during changes or migrations MUST be identified before execution.

## MUST NOT
- MUST NOT suppress persistent alerts without resolving the condition or documenting a bounded exception.
- MUST NOT alert only on host reachability when database-level failure can occur independently.
- MUST NOT treat dashboards as substitutes for alerting on urgent conditions.

## SHOULD
- Alerts SHOULD use sustained conditions or multi-signal evidence where this reduces noise without delaying detection.
- Trends SHOULD inform capacity and maintenance planning.

## Exceptions
Suppression requires reason, owner, expiry, alternate detection, and risk assessment.

## Verification
Review alert rules, notification tests, dashboards, incident history, false-positive rates, monitoring coverage, and telemetry retention.