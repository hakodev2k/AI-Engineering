# Observability and Monitoring Rules

## Purpose
Ensure Azure workloads expose evidence needed to detect, diagnose, and operate failures.

## Scope
Azure Monitor, Log Analytics, Application Insights, metrics, logs, traces, dashboards, alerts, and diagnostic settings.

## MUST
- Define service health indicators and actionable alerts for production-critical workloads.
- Configure diagnostic data needed for security, reliability, and incident investigation.
- Correlate telemetry across relevant distributed components where practical.
- Define retention according to operational, compliance, and cost requirements.
- Test high-severity alerts and their routing before relying on them.

## MUST NOT
- Alert on every metric anomaly without an actionable response.
- Log secrets, tokens, or unnecessary sensitive payloads.
- Declare an incident cause without supporting telemetry or equivalent evidence.

## SHOULD
- Prefer symptom-oriented alerts tied to user or service impact.
- Track telemetry ingestion cost and noisy sources.

## Exceptions
Reduced telemetry requires documented risk, alternative evidence, owner, and approval where material.

## Verification
Review diagnostic settings, queries, dashboards, alert rules, test notifications, traces, retention, and ingestion metrics.