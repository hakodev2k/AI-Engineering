# Observability and Alerting Rules

## Purpose
Provide actionable evidence about storage health, saturation, correctness, and user impact.

## Scope
Metrics, logs, events, traces, dashboards, SLOs, and alerts.

## MUST
- Critical storage services MUST expose capacity, latency, throughput, errors, availability, redundancy health, and recovery backlog where applicable.
- Alerts MUST correspond to actionable conditions with an owner and response guidance.
- Telemetry MUST distinguish client impact from backend component health where possible.
- Monitoring gaps affecting production safety MUST be treated as operational risk.

## MUST NOT
- MUST NOT rely on device-up status as evidence of storage service health.
- MUST NOT suppress recurring alerts without resolving, reclassifying, or formally accepting the underlying risk.
- MUST NOT include secrets or sensitive payloads in telemetry.

## SHOULD
- Prefer symptom/SLO alerts over noisy component thresholds while retaining diagnostic telemetry.

## Exceptions
Temporary monitoring gaps require compensating checks, expiry, and ownership.

## Verification
Inspect dashboards, alert rules, runbooks, telemetry coverage, alert history, and incident usefulness.