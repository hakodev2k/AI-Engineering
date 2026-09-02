# Observability and Operations Rules

## Purpose
Ensure cloud architectures expose sufficient operational evidence to detect, diagnose, and manage production behavior.

## Scope
Applies to logs, metrics, traces, health signals, dashboards, alerts, audit telemetry, runbooks, and operational ownership.

## MUST
- Production architectures MUST define telemetry for availability, latency, errors, saturation, critical dependencies, and business-critical flows where applicable.
- Logs and traces MUST preserve diagnostic context without exposing secrets or unnecessary sensitive data.
- Alerts MUST identify actionable conditions with an owner, severity, and response path.
- Critical dependencies and managed services MUST expose enough telemetry to distinguish application, platform, network, quota, and dependency failures.
- Operational readiness MUST include dashboards, runbooks, escalation paths, and known failure modes before high-risk production launch.

## MUST NOT
- MUST NOT treat log volume as observability coverage.
- MUST NOT create alerts with no credible operator action or ownership.
- MUST NOT rely solely on provider status pages for workload health conclusions.

## SHOULD
- Prefer telemetry aligned to service objectives and user impact.
- Correlate logs, metrics, and traces using stable request or transaction context where practical.

## Exceptions
Exceptions require documented visibility gaps, operational risk, compensating evidence, owner, and remediation or review date.

## Verification
Inspect telemetry configuration, dashboards, alert routing, trace continuity, audit logs, runbooks, incident records, and operational readiness reviews.