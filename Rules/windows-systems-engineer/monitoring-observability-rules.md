# Monitoring and Observability

## Purpose
Provide evidence for Windows health, capacity, security, and incident diagnosis.

## Scope
Event logs, performance counters, service state, telemetry, dashboards, alerts, and retention.

## MUST
- Critical services MUST expose actionable health signals tied to user or dependency impact.
- Alerts MUST identify condition, affected scope, severity, and an actionable investigation path.
- Time synchronization and telemetry transport failures MUST be detectable.
- Operational conclusions MUST use available logs, metrics, events, or equivalent evidence.
- Sensitive log data MUST be access-controlled and retained according to policy.

## MUST NOT
- MUST NOT treat host reachability alone as service health.
- MUST NOT log passwords, tokens, private keys, or equivalent secrets.
- MUST NOT create persistent noisy alerts without ownership and remediation.

## SHOULD
- Correlate host, identity, application, network, and dependency telemetry.
- Define baselines before tuning thresholds.

## Exceptions
Document missing telemetry, risk, temporary evidence source, owner, and remediation date.

## Verification
Review alert tests, dashboard coverage, event forwarding, retention, access controls, telemetry gaps, and incident evidence quality.